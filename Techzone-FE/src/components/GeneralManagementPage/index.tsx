"use client"
import React, { useEffect, useState, createContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import {
  mdiAccountEdit,
  mdiChevronRight,
  mdiOrderBoolAscending,
  mdiEye,
  mdiMapMarker,
  mdiCreditCardOutline,
  mdiCashMultiple,
  mdiContentSaveOutline,
  mdiTruck,
  mdiPackageVariant,
  mdiCheckCircle,
  mdiClockOutline,
  mdiCancel,
  mdiLogout,
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useUser } from '@/context/useUserContext';
import { useUser as useClerkUser, useClerk } from '@clerk/clerk-react';
import { useMyOrders, useOrderDetail } from '@/hooks/order';
import { useToast } from '@/hooks/useToast';
import { useUpdateUserProfile } from '@/hooks/account';
import { IMyOrder } from '@/interface/response/order';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const AccountTabContext = createContext({
  activeTab: 'profile',
  setActiveTab: (tab: string) => { },
});

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    'CHO_XAC_NHAN': { label: 'Chờ xác nhận', className: '!bg-yellow-400 !text-white !border-yellow-500 text-nowrap' },
    'CHO_GIAO_HANG': { label: 'Chờ giao hàng', className: '!bg-blue-400 !text-white !border-blue-500 text-nowrap' },
    'DANG_VAN_CHUYEN': { label: 'Đang vận chuyển', className: '!bg-orange-400 !text-white !border-orange-500 text-nowrap' },
    'DA_GIAO_HANG': { label: 'Đã giao hàng', className: '!bg-green-400 !text-white !border-green-500 text-nowrap' },
    'HOAN_THANH': { label: 'Hoàn thành', className: '!bg-emerald-400 !text-white !border-emerald-500 text-nowrap' },
    'DA_HUY': { label: 'Đã hủy', className: '!bg-red-400 !text-white !border-red-500 text-nowrap' },
  };

  const config = statusConfig[status] || { label: status, className: 'bg-gray-400 text-maintext border-gray-500' };

  return (
    <Badge className={`${config.className} rounded-[4px] font-normal`}>
      {config.label}
    </Badge>
  );
};

interface OrderDetailDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  orderId,
  open,
  onOpenChange
}) => {
  const { data: orderData, isLoading, isError } = useOrderDetail(orderId || '');

  const order = orderData?.data as any;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'VNPAY':
        return 'Thanh toán qua VNPay';
      case 'BANK_TRANSFER':
        return 'Chuyển khoản ngân hàng';
      default:
        return method;
    }
  };

  const getPaymentStatusName = (status: string) => {
    const normalizedStatus = status?.toUpperCase?.() || status;
    switch (status) {
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'PAID':
        return 'Đã thanh toán';
      case 'FAILED':
        return 'Thanh toán thất bại';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      default:
        switch (normalizedStatus) {
          case 'PENDING':
            return 'Chờ thanh toán';
          case 'PAID':
            return 'Đã thanh toán';
          case 'FAILED':
            return 'Thanh toán thất bại';
          case 'REFUNDED':
            return 'Đã hoàn tiền';
          default:
            return status;
        }
    }
  };

  const getShippingProgress = (orderStatus: string, createdAt: string) => {
    const orderDate = new Date(createdAt);
    const now = new Date();


    const generateTimestamp = (hoursOffset: number) => {
      const timestamp = new Date(orderDate.getTime() + hoursOffset * 60 * 60 * 1000);
      return format(timestamp, 'HH:mm dd/MM/yyyy', { locale: vi });
    };

    const baseProgress = [
      {
        time: generateTimestamp(0),
        title: "Đơn hàng được tạo",
        message: "GHN có thông tin chi tiết về gói hàng của bạn và đang chuẩn bị để vận chuyển",
        completed: true,
        icon: mdiClockOutline,
        color: "bg-blue-500"
      },
      {
        time: generateTimestamp(2),
        title: "Đang xử lý",
        message: "Kiện hàng của bạn đang được gửi đến trung tâm GHN và đang trong quá trình xử lý giao hàng",
        completed: true,
        icon: mdiPackageVariant,
        color: "bg-orange-500"
      }
    ];

    switch (orderStatus) {
      case 'pending':
        return [
          {
            time: generateTimestamp(0),
            title: "Chờ xác nhận",
            message: "Đơn hàng đã được tạo và đang chờ xác nhận từ cửa hàng",
            completed: true,
            icon: mdiClockOutline,
            color: "bg-yellow-500"
          }
        ];

      case 'confirmed':
        return [
          ...baseProgress,
          {
            time: generateTimestamp(4),
            title: "Đã xác nhận",
            message: "GHN đã xác nhận gói hàng của bạn bằng cách quét nhãn",
            completed: true,
            icon: mdiCheckCircle,
            color: "bg-green-500"
          },
          {
            time: generateTimestamp(6),
            title: "Chuẩn bị giao hàng",
            message: "Kiện hàng của bạn đã được gửi đi từ trung tâm GHN",
            completed: true,
            icon: mdiPackageVariant,
            color: "bg-blue-500"
          }
        ];

      case 'shipping':
        return [
          ...baseProgress,
          {
            time: generateTimestamp(4),
            title: "Đã xác nhận",
            message: "GHN đã xác nhận gói hàng của bạn bằng cách quét nhãn",
            completed: true,
            icon: mdiCheckCircle,
            color: "bg-green-500"
          },
          {
            time: generateTimestamp(6),
            title: "Đang vận chuyển",
            message: "Kiện hàng của bạn đã được gửi đi từ trung tâm GHN",
            completed: true,
            icon: mdiTruck,
            color: "bg-blue-500"
          },
          {
            time: generateTimestamp(12),
            title: "Đang phân loại",
            message: "Kiện hàng của bạn đang được chuyển đến trung tâm GHN để phân loại",
            completed: true,
            icon: mdiPackageVariant,
            color: "bg-orange-500"
          },
          {
            time: generateTimestamp(18),
            title: "Sẵn sàng giao hàng",
            message: "Kiện hàng của bạn đang ở cơ sở địa phương và sẵn sàng để giao hàng",
            completed: true,
            icon: mdiMapMarker,
            color: "bg-purple-500"
          }
        ];

      case 'completed':
        return [
          ...baseProgress,
          {
            time: generateTimestamp(4),
            title: "Đã xác nhận",
            message: "GHN đã xác nhận gói hàng của bạn bằng cách quét nhãn",
            completed: true,
            icon: mdiCheckCircle,
            color: "bg-green-500"
          },
          {
            time: generateTimestamp(6),
            title: "Đang vận chuyển",
            message: "Kiện hàng của bạn đã được gửi đi từ trung tâm GHN",
            completed: true,
            icon: mdiTruck,
            color: "bg-blue-500"
          },
          {
            time: generateTimestamp(12),
            title: "Đang phân loại",
            message: "Kiện hàng của bạn đang được chuyển đến trung tâm GHN để phân loại",
            completed: true,
            icon: mdiPackageVariant,
            color: "bg-orange-500"
          },
          {
            time: generateTimestamp(18),
            title: "Sẵn sàng giao hàng",
            message: "Kiện hàng của bạn đang ở cơ sở địa phương và sẵn sàng để giao hàng",
            completed: true,
            icon: mdiMapMarker,
            color: "bg-purple-500"
          },
          {
            time: generateTimestamp(24),
            title: "Đang giao hàng",
            message: "Kiện hàng của bạn đang được vận chuyển bằng xe GHN và sẽ được giao trong ngày hôm nay",
            completed: true,
            icon: mdiTruck,
            color: "bg-indigo-500"
          },
          {
            time: generateTimestamp(26),
            title: "Đã đến khu vực",
            message: "Kiện hàng của bạn đã đến cơ sở GHN tại khu vực của người nhận",
            completed: true,
            icon: mdiMapMarker,
            color: "bg-teal-500"
          },
          {
            time: generateTimestamp(28),
            title: "Giao hàng thành công",
            message: "Giao hàng thành công. Cảm ơn bạn đã sử dụng dịch vụ!",
            completed: true,
            icon: mdiCheckCircle,
            color: "bg-emerald-500"
          }
        ];

      case 'cancelled':
        return [
          {
            time: generateTimestamp(0),
            title: "Đơn hàng được tạo",
            message: "Đơn hàng đã được tạo",
            completed: true,
            icon: mdiClockOutline,
            color: "bg-blue-500"
          },
          {
            time: generateTimestamp(2),
            title: "Đơn hàng đã hủy",
            message: "Đơn hàng đã bị hủy theo yêu cầu",
            completed: true,
            icon: mdiCancel,
            color: "bg-red-500"
          }
        ];

      default:
        return baseProgress;
    }
  };

  if (!open || !orderId) return null;

  const getCustomerOrderStatusConfig = (status: string) => {
    const normalizedStatus = status?.toLowerCase?.() || '';
    const configs: Record<string, { label: string; className: string }> = {
      pending: { label: 'Chờ xác nhận', className: '!bg-yellow-400 !text-white !border-yellow-500 text-nowrap' },
      confirmed: { label: 'Đã xác nhận', className: '!bg-blue-400 !text-white !border-blue-500 text-nowrap' },
      shipping: { label: 'Đang giao', className: '!bg-orange-400 !text-white !border-orange-500 text-nowrap' },
      completed: { label: 'Hoàn thành', className: '!bg-emerald-400 !text-white !border-emerald-500 text-nowrap' },
      cancelled: { label: 'Đã hủy', className: '!bg-red-400 !text-white !border-red-500 text-nowrap' },
    };
    return configs[normalizedStatus] || { label: status || 'Không xác định', className: 'bg-gray-400 text-white border-gray-500' };
  };

  const statusConfig = order ? getCustomerOrderStatusConfig(order.status) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-red-500">Đã xảy ra lỗi khi tải thông tin đơn hàng.</p>
          </div>
        ) : order ? (
          <>
            <DialogHeader className="border-b pb-4">
              <DialogTitle>
                Chi tiết đơn hàng #{order.order_number || order.id}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Ngày đặt: {formatDate(order.created_at)}
              </DialogDescription>
              <div className="mt-2">
                {statusConfig && (
                  <Badge className={`${statusConfig.className} rounded-[4px] font-normal`}>
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Icon path={mdiMapMarker} size={0.7} className="mr-2" />
                      Địa chỉ giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Người nhận:</span>
                      <span className="font-medium">
                        {order.delivery_name || 'Chưa cập nhật'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Số điện thoại:</span>
                      <span>
                        {order.delivery_phone || 'Chưa cập nhật'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Địa chỉ:</span>
                      <span>
                        {order.delivery_address || 'Chưa cập nhật địa chỉ giao hàng'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Icon path={mdiCreditCardOutline} size={0.7} className="mr-2" />
                      Thông tin thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Phương thức:</span>
                      <div className="flex items-center">
                        <Icon
                          path={order.payment_method === 'COD' ? mdiCashMultiple : mdiCreditCardOutline}
                          size={0.7}
                          className="mr-2 text-primary"
                        />
                        <span>{getPaymentMethodName(order.payment_method)}</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">Trạng thái:</span>
                      <span>
                        <Badge className={order.payment_status?.toUpperCase?.() === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' : '!bg-extra text-white'}>
                          {getPaymentStatusName(order.payment_status)}
                        </Badge>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Icon path={mdiOrderBoolAscending} size={0.7} className="mr-2" />
                    Chi tiết đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Hình ảnh</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items?.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <img
                              src={item.image_url || "/images/white-image.png"}
                              alt={item.product_name || ''}
                              className="w-16 h-16 object-contain rounded-md"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium">{item.product_name || 'Sản phẩm không xác định'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(parseFloat(item.unit_price?.toString() || '0'))}
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatPrice(parseFloat(item.subtotal?.toString() || '0'))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tạm tính:</span>
                      <span>{formatPrice(parseFloat(order.subtotal?.toString() || '0'))}</span>
                    </div>
                    {parseFloat(order.discount_amount?.toString() || '0') > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatPrice(parseFloat(order.discount_amount?.toString() || '0'))}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Phí vận chuyển:</span>
                      <span>{formatPrice(parseFloat(order.shipping_fee?.toString() || '0'))}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                      <span>Tổng tiền:</span>
                      <span className="text-primary">
                        {formatPrice(parseFloat(order.total_amount?.toString() || '0'))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon path={mdiTruck} size={0.7} className="mr-3 text-primary" />
                    Tiến trình đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative">
                    {getShippingProgress(order.status, order.created_at).map((step, index, array) => (
                      <div key={index} className="relative flex items-start pb-8 last:pb-0">
                        {index < array.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-200"></div>
                        )}
                        <div className="relative flex-shrink-0 mr-4">
                          <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center shadow-lg ring-4 ring-white`}>
                            <Icon path={step.icon} size={0.7} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-maintext">{step.title}</h4>
                            <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded-full">
                              {step.time}
                            </span>
                          </div>
                          <p className="text-sm text-maintext leading-relaxed">
                            {step.message}
                          </p>
                          {step.completed && (
                            <div className="mt-3 flex items-center text-xs text-green-600">
                              <Icon path={mdiCheckCircle} size={0.7} className="mr-1" />
                              Hoàn thành
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Không tìm thấy thông tin đơn hàng.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
const ProfileTab = () => {
  const { profile } = useUser();
  const userData = profile?.data;
  const { user: clerkUser } = useClerkUser();
  const { showToast } = useToast();
  const updateProfileMutation = useUpdateUserProfile();

  const clerkFullName = clerkUser?.externalAccounts?.[0]?.firstName
    || clerkUser?.fullName
    || (clerkUser?.firstName && clerkUser?.lastName ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim() : clerkUser?.firstName || '');
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || '';
  const clerkPhoneNumber = clerkUser?.primaryPhoneNumber?.phoneNumber || clerkUser?.phoneNumbers?.[0]?.phoneNumber || '';
  const clerkImageUrl = clerkUser?.externalAccounts?.[0]?.imageUrl || clerkUser?.imageUrl || '';

  const displayFullName = clerkFullName || userData?.fullName || "";
  const displayEmail = clerkEmail || userData?.email || "";
  const displayPhoneNumber = clerkPhoneNumber || userData?.phoneNumber || "";
  const displayImageUrl = clerkImageUrl || "";

  const formSchema = z.object({
    fullName: z.string().min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phoneNumber: z.string().regex(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ" }).optional().or(z.literal(''))
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: displayFullName,
      email: displayEmail,
      phoneNumber: displayPhoneNumber
    }
  });


  useEffect(() => {
    const fullName = clerkFullName || userData?.fullName || "";
    const email = clerkEmail || userData?.email || "";
    const phoneNumber = clerkPhoneNumber || userData?.phoneNumber || "";

    form.reset({
      fullName,
      email,
      phoneNumber
    });
  }, [clerkUser, userData, form, clerkFullName, clerkEmail, clerkPhoneNumber]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProfileMutation.mutate(
      {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber || undefined
      },
      {
        onSuccess: (response) => {
          showToast({
            title: "Cập nhật thành công",
            message: "Thông tin cá nhân đã được cập nhật",
            type: "success"
          });
        },
        onError: (error) => {
          showToast({
            title: "Lỗi",
            message: error.message || "Đã xảy ra lỗi khi cập nhật thông tin",
            type: "error"
          });
        }
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon path={mdiAccountEdit} size={0.7} className='text-primary' />
          <span>Cập nhật thông tin cá nhân</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="sm:w-1/3 flex flex-col items-center space-y-4">
                {displayImageUrl ? (
                  <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20">
                    <img
                      src={displayImageUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-semibold">
                    {displayFullName?.charAt(0)?.toUpperCase() || displayEmail?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="sm:w-2/3 space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Email không thể thay đổi
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                ) : (
                  <Icon path={mdiContentSaveOutline} size={0.7} />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default function GeneralManagementPage() {
  const navigate = useNavigate();
  const location = useLocation(); const pathname = location.pathname;
  const [activeTab, setActiveTab] = useState('profile');
  const { isAuthenticated, profile, isLoadingProfile } = useUser();
  const { user: clerkUser, isSignedIn: isClerkSignedIn } = useClerkUser();
  const { signOut } = useClerk();
  const [currentPage, setCurrentPage] = useState(1);
  const clerkPrimaryEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress ||
    '';
  const profileEmail = profile?.data?.email || '';
  const customerEmail = clerkPrimaryEmail || profileEmail || '';
  const ordersQueryPayload = useMemo(
    () => ({
      email: customerEmail,
      page: currentPage,
      limit: 10,
    }),
    [customerEmail, currentPage]
  );
  const {
    data: myOrdersData,
    isLoading: isMyOrdersLoading,
    isError: isMyOrdersError,
    refetch: refetchMyOrders,
  } = useMyOrders(ordersQueryPayload);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);

  useEffect(() => {
    const updateActiveTabFromHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#account-tabs') {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');

        if (tabParam && ['profile', 'password', 'settings', 'orders', 'vouchers', 'returns'].includes(tabParam)) {
          setActiveTab(tabParam);
        } else {
          setActiveTab('profile');
        }
      }
    };
    updateActiveTabFromHash();
    window.addEventListener('hashchange', updateActiveTabFromHash);

    return () => {
      window.removeEventListener('hashchange', updateActiveTabFromHash);
    };
  }, []);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabs = [
    {
      title: 'Thông tin cá nhân',
      icon: mdiAccountEdit,
      value: 'profile',
    },
    {
      title: 'Đơn hàng của bạn',
      icon: mdiOrderBoolAscending,
      value: 'orders',
    },
  ];

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetailOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Đăng xuất thành công');
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi đăng xuất');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [customerEmail]);

  const isOrderReturnable = (order: IMyOrder) => {
    const normalizedStatus = order.status?.toLowerCase();
    return normalizedStatus === 'completed';
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    const safeValue = typeof numericPrice === 'number' && Number.isFinite(numericPrice) ? numericPrice : 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(safeValue);
  };

  const getPaymentMethodName = (method: string) => {
    const normalizedMethod = method?.toUpperCase?.() || method;
    switch (normalizedMethod) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'VNPAY':
        return 'Thanh toán qua VNPay';
      case 'BANK_TRANSFER':
        return 'Chuyển khoản ngân hàng';
      default:
        return method;
    }
  };

  const getPaymentStatusName = (status: string) => {
    const normalizedStatus = status?.toUpperCase?.() || status;
    switch (normalizedStatus) {
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'PAID':
        return 'Đã thanh toán';
      case 'FAILED':
        return 'Thanh toán thất bại';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    const normalizedStatus = status?.toUpperCase?.() || status;
    if (normalizedStatus === 'PAID') {
      return '!bg-emerald-400 !text-white !border-emerald-500 text-nowrap !rounded';
    }
    if (normalizedStatus === 'PENDING') {
      return '!bg-yellow-400 !text-white !border-yellow-500 text-nowrap !rounded';
    }
    if (normalizedStatus === 'FAILED') {
      return '!bg-red-400 !text-white !border-red-500 text-nowrap !rounded';
    }
    if (normalizedStatus === 'REFUNDED') {
      return '!bg-blue-500 !text-white !border-blue-600 text-nowrap !rounded';
    }
    return 'bg-muted text-maintext border-muted text-nowrap !rounded';
  };

  const getCustomerOrderStatusConfig = (status: string) => {
    const normalizedStatus = status?.toLowerCase?.() || '';
    const configs: Record<string, { label: string; className: string }> = {
      pending: { label: 'Chờ xác nhận', className: '!bg-yellow-400 !text-white !border-yellow-500 text-nowrap' },
      confirmed: { label: 'Đã xác nhận', className: '!bg-blue-400 !text-white !border-blue-500 text-nowrap' },
      shipping: { label: 'Đang giao', className: '!bg-orange-400 !text-white !border-orange-500 text-nowrap' },
      completed: { label: 'Hoàn thành', className: '!bg-emerald-400 !text-white !border-emerald-500 text-nowrap' },
      cancelled: { label: 'Đã hủy', className: '!bg-red-400 !text-white !border-red-500 text-nowrap' },
    };
    return configs[normalizedStatus] || { label: status || 'Không xác định', className: 'bg-gray-400 text-white border-gray-500' };
  };

  const formatOrderDateTime = (dateString?: string | null) => {
    if (!dateString) {
      return 'Không xác định';
    }
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return 'Không xác định';
    }
  };

  return (
    <AccountTabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full mx-auto p-8 relative">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="!text-maintext hover:!text-maintext">
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
            <BreadcrumbItem>
              <BreadcrumbPage className="!text-maintext hover:!text-maintext">Quản lý chung</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <motion.div
            className="md:col-span-3"
            initial="hidden"
            animate="visible"
          >
            <Card className="sticky">
              <CardHeader>
                <CardTitle>Quản lý chung</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col" id="account-sidebar-tabs">
                  {tabs.map((tab) => (
                    <motion.div
                      key={tab.value}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href={`#account-tabs?tab=${tab.value}`}
                        data-value={tab.value}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-muted ${activeTab === tab.value ? 'bg-muted text-primary font-medium' : ''
                          }`}
                        onClick={() => {
                          setActiveTab(tab.value);
                          const tabContentElement = document.getElementById('account-tabs');
                          if (tabContentElement) {
                            tabContentElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <Icon path={tab.icon} size={0.7} className={`mr-3 text-maintext ${activeTab === tab.value ? 'text-primary' : ''}`} />
                          <span className='text-maintext'>{tab.title}</span>
                        </div>
                        {activeTab === tab.value && (
                          <Icon path={mdiChevronRight} size={0.7} className="text-primary" />
                        )}
                      </a>
                    </motion.div>
                  ))}
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted w-full text-left text-red-600 hover:text-red-700"
                    >
                      <div className="flex items-center">
                        <Icon path={mdiLogout} size={0.7} className="mr-3" />
                        <span>Đăng xuất</span>
                      </div>
                    </button>
                  </motion.div>
                </nav>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            className="md:col-span-9 -mt-2"
            initial="hidden"
            animate="visible"
          >
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="profile">
                {activeTab === 'profile' && <ProfileTab />}
              </TabsContent>
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Icon path={mdiOrderBoolAscending} size={0.7} className='text-primary' />
                      <span>Đơn hàng của bạn</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!customerEmail ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">
                          Vui lòng cập nhật email đăng nhập để xem lịch sử đơn hàng của bạn.
                        </p>
                        <Button variant="outline" asChild>
                          <a href="#account-tabs?tab=profile">Cập nhật hồ sơ</a>
                        </Button>
                      </div>
                    ) : isMyOrdersLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : isMyOrdersError ? (
                      <div className="py-8 text-center">
                        <p className="text-red-500">Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau.</p>
                      </div>
                    ) : !myOrdersData || !myOrdersData.data || myOrdersData.data.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào.</p>
                        <Button variant="outline" asChild>
                          <a href="/products">Mua sắm ngay</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table className="min-w-[1100px]">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[140px] text-maintext px-3 py-2 whitespace-nowrap">Mã đơn hàng</TableHead>
                              <TableHead className="w-[160px] px-3 text-maintext py-2 whitespace-nowrap">Ngày đặt</TableHead>
                              <TableHead className="w-[260px] px-3 text-maintext py-2 whitespace-nowrap">Thông tin giao hàng</TableHead>
                              <TableHead className="w-[140px] text-right px-3 py-2 whitespace-nowrap text-maintext">Tổng tiền</TableHead>
                              <TableHead className="w-[160px] px-3 text-maintext py-2 whitespace-nowrap">Trạng thái đơn</TableHead>
                              <TableHead className="w-[180px] px-3 py-2 whitespace-nowrap text-maintext">Phương thức thanh toán</TableHead>
                              <TableHead className="w-[160px] px-3 py-2 whitespace-nowrap text-maintext">Trạng thái thanh toán</TableHead>
                              <TableHead className="w-[120px] text-center px-3 py-2 whitespace-nowrap">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {myOrdersData.data.map((order: IMyOrder) => {
                              const statusConfig = getCustomerOrderStatusConfig(order.status);
                              return (
                                <TableRow key={order.id}>
                                  <TableCell className="font-medium px-3 py-2 whitespace-nowrap text-maintext">
                                    {order.order_number || `#${order.id}`}
                                  </TableCell>
                                  <TableCell className="px-3 py-2 whitespace-nowrap text-maintext">
                                    {formatOrderDateTime(order.created_at)}
                                  </TableCell>
                                  <TableCell className="px-3 py-2">
                                    <div className="text-sm text-maintext">
                                      {order.delivery_address || 'Chưa cập nhật địa chỉ'}
                                    </div>
                                    {order.delivery_phone && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        SĐT: {order.delivery_phone}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right px-3 font-semibold py-2 whitespace-nowrap text-maintext">
                                    {formatPrice(order.total_amount)}
                                  </TableCell>
                                  <TableCell className="px-3 py-2">
                                    <Badge className={`${statusConfig.className} rounded-[4px] font-normal`}>
                                      {statusConfig.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="px-3 py-2 whitespace-nowrap text-maintext font-semibold">
                                    {getPaymentMethodName(order.payment_method)}
                                  </TableCell>
                                  <TableCell className="px-3 py-2">
                                    <Badge className={getPaymentStatusBadgeClass(order.payment_status)}>
                                      {getPaymentStatusName(order.payment_status)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center px-3 py-2">
                                    <div className="flex items-center justify-start space-x-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleViewOrderDetails(String(order.id))}
                                        title="Xem chi tiết"
                                      >
                                        <Icon path={mdiEye} size={0.7} />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>

                        {myOrdersData.pagination && myOrdersData.pagination.totalPages > 1 && (
                          <div className="flex items-center justify-center space-x-2 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                              Trang trước
                            </Button>
                            <div className="text-sm text-muted-foreground">
                              Trang {currentPage} / {myOrdersData.pagination.totalPages}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage === myOrdersData.pagination.totalPages}
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  myOrdersData.pagination ? Math.min(prev + 1, myOrdersData.pagination.totalPages) : prev + 1
                                )
                              }
                            >
                              Trang sau
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      <OrderDetailDialog
        orderId={selectedOrderId}
        open={orderDetailOpen}
        onOpenChange={setOrderDetailOpen}
      />
    </AccountTabContext.Provider>
  );
} 