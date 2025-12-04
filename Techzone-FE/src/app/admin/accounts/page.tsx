'use client';

import { useState, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@mdi/react';
import {
  mdiMagnify,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiAccountKey,
  mdiCheck,
  mdiClose,
  mdiLock,
  mdiLockReset,
  mdiEmail,
  mdiPhone,
  mdiFilterOutline,
  mdiLoading,
  mdiDotsVertical,
} from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-toastify';
import { useAccounts, useDeleteAccount, useUpdateAccountStatus } from '@/hooks/account';
import { IAccountFilter, IAccountStatusUpdate } from '@/interface/request/account';
import { IAccount } from '@/interface/response/account';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IAccountFilter>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<IAccount | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [accountToUpdateStatus, setAccountToUpdateStatus] = useState<IAccount | null>(null);
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const { data, isLoading, error } = useAccounts(filters);
  const deleteAccount = useDeleteAccount();
  const updateAccountStatus = useUpdateAccountStatus(String(accountToUpdateStatus?.id || ''));
  const queryClient = useQueryClient();

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
      } else {
        const { search, ...rest } = filters;
        setFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleFilterChange = (key: keyof IAccountFilter, value: string | number | undefined) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, page: 1 };

      if (value === '' || value === undefined) {
        const { [key]: _, ...rest } = updatedFilters;
        return rest;
      }

      return { ...updatedFilters, [key]: value };
    });
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };


  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa xác định';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };


  const getRoleBadge = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-purple-600 text-white hover:bg-purple-700">Quản trị viên</Badge>;
      case 'staff':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Nhân viên</Badge>;
      case 'customer':
        return <Badge className="bg-slate-600 text-white hover:bg-slate-700">Khách hàng</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{roleName || 'N/A'}</Badge>;
    }
  };


  const getStatusBadge = (isActive: number) => {
    return isActive === 1 ? (
      <Badge className="bg-green-600 text-white hover:bg-green-700">Hoạt động</Badge>
    ) : (
      <Badge className="bg-red-600 text-white hover:bg-red-700">Không hoạt động</Badge>
    );
  };

  const getClassificationBadge = (classification: string | null) => {
    if (!classification) return null;
    switch (classification) {
      case 'vip':
        return <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">VIP</Badge>;
      case 'regular':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Thường xuyên</Badge>;
      case 'new':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Mới</Badge>;
      default:
        return null;
    }
  };


  const getInitials = (name: string | undefined) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomAvatar = () => {
    const avatarCount = 4;
    const randomIndex = Math.floor(Math.random() * avatarCount) + 1;
    return `/images/dfavatar${randomIndex}.png`;
  };

  const handleDeleteAccount = (account: IAccount) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;

    try {
      await deleteAccount.mutateAsync(String(accountToDelete.id), {
        onSuccess: () => {
          toast.success('Xóa tài khoản thành công');
          setIsDeleteDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (error) => {
          toast.error('Xóa tài khoản thất bại: ' + (error.message || 'Không xác định'));
        }
      });
    } catch (error) {
      toast.error('Xóa tài khoản thất bại');
    }
  };

  const handleUpdateStatus = (account: IAccount, status: 'ACTIVE' | 'INACTIVE') => {
    setAccountToUpdateStatus(account);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(parseFloat(amount));
  };

  const confirmUpdateStatus = async () => {
    if (!accountToUpdateStatus) return;

    const statusUpdate: IAccountStatusUpdate = {
      status: newStatus
    };

    try {
      await updateAccountStatus.mutateAsync(statusUpdate, {
        onSuccess: () => {
          toast.success(`Cập nhật trạng thái tài khoản thành công`);
          setIsStatusDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (error) => {
          toast.error('Cập nhật trạng thái tài khoản thất bại: ' + (error.message || 'Không xác định'));
        }
      });
    } catch (error) {
      toast.error('Cập nhật trạng thái tài khoản thất bại');
    }
  };

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Quản lý người dùng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách tài khoản</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <a href="/admin/accounts/create" className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Icon path={mdiPlus} size={0.7} />
            Thêm tài khoản mới
          </Button>
        </a>
      </div>

      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center gap-2">
            <div className="relative flex-1 max-w-4xl">
              <Icon
                path={mdiMagnify}
                size={0.7}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                className="pl-10 pr-4 py-2 w-full border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.role ?? 'all'}
                onValueChange={(value) => handleFilterChange('role', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder="Tất cả vai trò" />
                </SelectTrigger>
                <SelectContent className='w-48'>
                  <SelectItem value="all" className="text-maintext font-semibold">Tất cả vai trò</SelectItem>
                  <SelectItem value="admin" className="text-maintext font-medium">Quản trị viên</SelectItem>
                  <SelectItem value="staff" className="text-maintext font-medium">Nhân viên</SelectItem>
                  <SelectItem value="customer" className="text-maintext font-medium">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.classification ?? 'all'}
                onValueChange={(value) => handleFilterChange('classification', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder="Phân loại khách hàng" />
                </SelectTrigger>
                <SelectContent className='w-48'>
                  <SelectItem value="all" className="text-maintext font-semibold">Phân loại khách hàng</SelectItem>
                  <SelectItem value="vip" className="text-maintext font-medium">VIP</SelectItem>
                  <SelectItem value="regular" className="text-maintext font-medium">Thường xuyên</SelectItem>
                  <SelectItem value="new" className="text-maintext font-medium">Mới</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Icon path={mdiLoading} size={2} className="animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-xl font-bold text-red-500">Đã xảy ra lỗi</h2>
              <p className="text-maintext">{error.message || 'Không thể tải dữ liệu tài khoản'}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Phân loại</TableHead>
                    <TableHead>Thống kê</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!data?.data || data.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-maintext">
                        Không có tài khoản nào được tìm thấy
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.map((account) => (
                      <TableRow key={account.id} className="hover:bg-gray-50">
                        <TableCell className="py-3 px-4">
                          <div className="flex items-center space-x-4">
                            <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                              <Avatar className="h-10 w-10 border-2 border-white rounded-full">
                                <AvatarImage src={getRandomAvatar()} alt={`${account.full_name} avatar`} />
                                <AvatarFallback className="bg-gray-200 text-maintext">{getInitials(account.full_name)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <div className="font-medium text-maintext">{account.full_name}</div>
                              <div className="text-sm text-maintext">{account.email}</div>
                              {account.store_name && (
                                <div className="text-xs text-gray-500 mt-1">📍 {account.store_name}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm text-maintext">
                          {account.phone && (
                            <div className="flex items-center">
                              <Icon path={mdiPhone} size={0.7} className="mr-2 text-maintext" />
                              {account.phone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4">{getRoleBadge(account.role_name)}</TableCell>
                        <TableCell className="py-3 px-4">{getStatusBadge(account.is_active)}</TableCell>
                        <TableCell className="py-3 px-4">
                          {getClassificationBadge(account.classification) || (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm text-maintext">
                          {account.role_name === 'customer' && (
                            <div className="space-y-1">
                              <div>Đơn hàng: {account.total_orders || 0}</div>
                              <div>Tổng chi: {formatCurrency(account.total_spent)}</div>
                            </div>
                          )}
                          {account.role_name !== 'customer' && (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm text-maintext">{formatDate(account.created_at)}</TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                              >
                                <Icon path={mdiDotsVertical} size={0.7} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <a href={`/admin/accounts/edit/${String(account.id)}`}>
                                <DropdownMenuItem className="cursor-pointer text-maintext">
                                  <Icon path={mdiPencil} size={0.7} className="mr-2" />
                                  <span className="text-maintext">Chỉnh sửa</span>
                                </DropdownMenuItem>
                              </a>
                              <DropdownMenuSeparator />
                              {account.is_active === 1 ? (
                                <DropdownMenuItem
                                  className="cursor-pointer text-maintext"
                                  onClick={() => handleUpdateStatus(account, 'INACTIVE')}
                                >
                                  <Icon path={mdiLock} size={0.7} className="mr-2" />
                                  <span className="text-maintext">Vô hiệu hóa</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="cursor-pointer text-maintext"
                                  onClick={() => handleUpdateStatus(account, 'ACTIVE')}
                                >
                                  <Icon path={mdiLockReset} size={0.7} className="mr-2" />
                                  <span className="text-maintext">Kích hoạt</span>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() => handleDeleteAccount(account)}
                              >
                                <Icon path={mdiDelete} size={0.7} className="mr-2" />
                                <span className="text-red-600">Xóa tài khoản</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-maintext">
                    Hiển thị {(data.pagination.page - 1) * (filters.limit || 10) + 1} đến{' '}
                    {Math.min(data.pagination.page * (filters.limit || 10), data.pagination.total)}{' '}
                    trong tổng số {data.pagination.total} tài khoản
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangePage(data.pagination.page - 1)}
                      disabled={data.pagination.page === 1}
                    >
                      Trước
                    </Button>
                    {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === data.pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleChangePage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangePage(data.pagination.page + 1)}
                      disabled={data.pagination.page === data.pagination.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>


      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản <span className="font-semibold">{accountToDelete?.full_name}</span>?
              <br />
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteAccount}
              disabled={deleteAccount.isPending}
              className="flex items-center gap-2"
            >
              {deleteAccount.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Icon path={mdiDelete} size={0.7} />
                  Xác nhận xóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'ACTIVE' ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
            </DialogTitle>
            <DialogDescription>
              {newStatus === 'ACTIVE' ? (
                <>
                  Bạn có chắc chắn muốn kích hoạt tài khoản <span className="font-semibold">{accountToUpdateStatus?.full_name}</span>?
                  <br />
                  Tài khoản này sẽ có thể đăng nhập và sử dụng hệ thống.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn vô hiệu hóa tài khoản <span className="font-semibold">{accountToUpdateStatus?.full_name}</span>?
                  <br />
                  Tài khoản này sẽ không thể đăng nhập và sử dụng hệ thống cho đến khi được kích hoạt lại.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={newStatus === 'ACTIVE' ? 'default' : 'destructive'}
              onClick={confirmUpdateStatus}
              disabled={updateAccountStatus.isPending}
              className="flex items-center gap-2"
            >
              {updateAccountStatus.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : newStatus === 'ACTIVE' ? (
                <>
                  <Icon path={mdiCheck} size={0.7} />
                  Kích hoạt
                </>
              ) : (
                <>
                  <Icon path={mdiLock} size={0.7} />
                  Vô hiệu hóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 