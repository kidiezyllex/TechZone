'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@mdi/react';
import {
    mdiMagnify,
    mdiFilterOutline,
    mdiPencilOutline,
    mdiTrashCanOutline,
    mdiStorePlus,
    mdiMapMarker,
    mdiPhone,
    mdiAccountTie,
    mdiCheckCircle,
    mdiAlertCircleOutline,
} from '@mdi/js';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import {
    useCreateStore,
    useDeleteStore,
    useStoreDetail,
    useStoreDropdown,
    useStores,
    useUpdateStore,
} from '@/hooks/store';
import { IStore } from '@/interface/response/store';
import { IStoreCreateRequest, IStoreListParams } from '@/interface/request/store';

const storeFormSchema = z.object({
    name: z.string().min(3, 'Tên cửa hàng tối thiểu 3 ký tự'),
    address: z.string().min(5, 'Địa chỉ tối thiểu 5 ký tự'),
    city: z.string().min(2, 'Vui lòng nhập thành phố'),
    district: z.string().min(2, 'Vui lòng nhập quận/huyện'),
    phone: z
        .string()
        .min(9, 'Số điện thoại không hợp lệ')
        .max(15, 'Số điện thoại tối đa 15 ký tự'),
    manager_id: z.coerce.number().min(1, 'Manager ID phải lớn hơn 0'),
    is_active: z.boolean().default(true),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

const defaultFormValues: StoreFormValues = {
    name: '',
    address: '',
    city: '',
    district: '',
    phone: '',
    manager_id: 1,
    is_active: true,
};

const isStoreActive = (value?: boolean | number) => value === true || value === 1;

const StatusBadge = ({ isActive }: { isActive: boolean | number | undefined }) => (
    <Badge className={isStoreActive(isActive) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}>
        {isStoreActive(isActive) ? 'Đang hoạt động' : 'Ngưng hoạt động'}
    </Badge>
);

const formatDateTime = (value?: string) => {
    if (!value) return 'Chưa cập nhật';
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));
    } catch {
        return value;
    }
};

const StoreDetailDialog = ({
    open,
    storeId,
    onOpenChange,
}: {
    open: boolean;
    storeId: number | null;
    onOpenChange: (open: boolean) => void;
}) => {
    const { data, isLoading, isError, refetch } = useStoreDetail(storeId ?? undefined);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Chi tiết cửa hàng</DialogTitle>
                    <DialogDescription>Xem thông tin mới nhất về cửa hàng được chọn</DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, index) => (
                            <Skeleton key={index} className="h-6 w-full" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="py-8 text-center space-y-4">
                        <p className="text-red-500">Không thể tải dữ liệu. Vui lòng thử lại.</p>
                        <Button variant="outline" onClick={() => refetch()}>
                            Thử lại
                        </Button>
                    </div>
                ) : data?.data ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tên cửa hàng</p>
                                <p className="text-lg font-semibold">{data.data.name}</p>
                            </div>
                            <StatusBadge isActive={data.data.is_active} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                                <p className="font-medium">{data.data.address}</p>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    {data.data.district && (
                                        <Badge variant="outline" className="border-dashed text-maintext px-2 py-0.5">
                                            {data.data.district}
                                        </Badge>
                                    )}
                                    {data.data.city && (
                                        <Badge className="bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 flex items-center gap-1">
                                            <Icon path={mdiMapMarker} size={0.5} />
                                            {data.data.city}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Liên hệ</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <Icon path={mdiPhone} size={0.7} />
                                    {data.data.phone}
                                </p>
                                {(data.data.manager_name || data.data.manager_id) && (
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon path={mdiAccountTie} size={0.7} />
                                        Quản lý: {data.data.manager_name || (data.data.manager_id ? `#${data.data.manager_id}` : 'Chưa cập nhật')}
                                    </p>
                                )}
                                {data.data.email && (
                                    <p className="text-sm text-muted-foreground">{data.data.email}</p>
                                )}
                                {data.data.google_maps_url && (
                                    <a
                                        href={data.data.google_maps_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary underline"
                                    >
                                        Mở Google Maps
                                    </a>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Số liệu tổng quan</p>
                                <p className="text-sm">
                                    Tổng sản phẩm: <span className="font-semibold">{data.data.total_products ?? 0}</span>
                                </p>
                                <p className="text-sm">
                                    Tổng nhân viên: <span className="font-semibold">{data.data.total_staff ?? 0}</span>
                                </p>
                                <p className="text-sm">
                                    Tổng đơn hàng: <span className="font-semibold">{data.data.total_orders ?? 0}</span>
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Ngày cập nhật</p>
                                <p className="font-medium">Tạo: {formatDateTime(data.data.created_at)}</p>
                                <p className="font-medium">Cập nhật: {formatDateTime(data.data.updated_at)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="py-8 text-center text-muted-foreground">Chưa có dữ liệu chi tiết.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default function StoresPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [filters, setFilters] = useState<IStoreListParams>({ page: 1, limit: 10 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [storeToDelete, setStoreToDelete] = useState<IStore | null>(null);
    const [detailStoreId, setDetailStoreId] = useState<number | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useStores(filters);
    const dropdownQuery = useStoreDropdown();
    const createStoreMutation = useCreateStore();
    const updateStoreMutation = useUpdateStore();
    const deleteStoreMutation = useDeleteStore();

    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeFormSchema),
        defaultValues: defaultFormValues,
    });

    useEffect(() => {
        const debounce = setTimeout(() => {
            setFilters((prev) => {
                const next: IStoreListParams = { ...prev, page: 1 };
                if (searchQuery.trim()) {
                    next.search = searchQuery.trim();
                } else {
                    delete next.search;
                }
                return next;
            });
        }, 400);

        return () => clearTimeout(debounce);
    }, [searchQuery]);

    useEffect(() => {
        setFilters((prev) => {
            const next: IStoreListParams = { ...prev, page: 1 };
            if (statusFilter === 'all') {
                delete next.is_active;
            } else {
                next.is_active = statusFilter === 'active';
            }
            return next;
        });
    }, [statusFilter]);

    useEffect(() => {
        if (selectedStore && isFormOpen && formMode === 'edit') {
            form.reset({
                name: selectedStore.name,
                address: selectedStore.address,
                city: selectedStore.city,
                district: selectedStore.district,
                phone: selectedStore.phone,
                manager_id: selectedStore.manager_id,
                is_active: isStoreActive(selectedStore.is_active),
            });
        } else if (!isFormOpen) {
            form.reset(defaultFormValues);
        }
    }, [selectedStore, isFormOpen, formMode, form]);

    const stores = data?.data ?? [];
    const pagination = data?.pagination;
    const currentPage = pagination?.page ?? filters.page ?? 1;
    const perPage = pagination?.limit ?? filters.limit ?? 10;
    const totalItems = pagination?.total ?? stores.length;
    const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(totalItems / perPage));

    const handleChangePage = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const openCreateForm = () => {
        setSelectedStore(null);
        setFormMode('create');
        setIsFormOpen(true);
    };

    const openEditForm = (store: IStore) => {
        setSelectedStore(store);
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const openDeleteDialog = (store: IStore) => {
        setStoreToDelete(store);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmitForm = async (values: StoreFormValues) => {
        const payload: IStoreCreateRequest = {
            name: values.name,
            address: values.address,
            city: values.city,
            district: values.district,
            phone: values.phone,
            manager_id: values.manager_id,
            is_active: values.is_active,
        };
        try {
            if (formMode === 'create') {
                await createStoreMutation.mutateAsync(payload, {
                    onSuccess: () => {
                        toast.success('Tạo cửa hàng thành công');
                        queryClient.invalidateQueries({ queryKey: ['stores'] });
                        dropdownQuery.refetch();
                        setIsFormOpen(false);
                    },
                    onError: (error: any) => {
                        toast.error(error?.response?.data?.message || 'Không thể tạo cửa hàng');
                    },
                });
            } else if (selectedStore) {
                await updateStoreMutation.mutateAsync(
                    { storeId: selectedStore.id, payload },
                    {
                        onSuccess: () => {
                            toast.success('Cập nhật cửa hàng thành công');
                            queryClient.invalidateQueries({ queryKey: ['stores'] });
                            dropdownQuery.refetch();
                            setIsFormOpen(false);
                        },
                        onError: (error: any) => {
                            toast.error(error?.response?.data?.message || 'Không thể cập nhật cửa hàng');
                        },
                    },
                );
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Đã xảy ra lỗi');
        }
    };

    const handleConfirmDelete = async () => {
        if (!storeToDelete) return;
        try {
            await deleteStoreMutation.mutateAsync(storeToDelete.id, {
                onSuccess: () => {
                    toast.success('Đã ngưng kích hoạt cửa hàng');
                    queryClient.invalidateQueries({ queryKey: ['stores'] });
                    dropdownQuery.refetch();
                    setIsDeleteDialogOpen(false);
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Không thể xóa cửa hàng');
                },
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Không thể xóa cửa hàng');
        }
    };

    const quickSelectStore = (value: string) => {
        const storeId = Number(value);
        if (!Number.isNaN(storeId)) {
            setDetailStoreId(storeId);
            setIsDetailOpen(true);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin/stores">Quản lý cửa hàng</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Danh sách cửa hàng</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Select onValueChange={quickSelectStore}>
                        <SelectTrigger className="w-full sm:w-64">
                            <SelectValue placeholder="Chọn nhanh cửa hàng..." />
                        </SelectTrigger>
                        <SelectContent>
                            {(dropdownQuery.data?.data ?? []).map((store) => (
                                <SelectItem key={store.id} value={store.id.toString()}>
                                    {store.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={openCreateForm} className="flex items-center gap-2">
                        <Icon path={mdiStorePlus} size={0.7} />
                        Thêm cửa hàng
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="py-4 space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1">
                            <Icon
                                path={mdiMagnify}
                                size={0.7}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                className="pl-10"
                                placeholder="Tìm theo tên, địa chỉ hoặc thành phố..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={String(filters.limit)} onValueChange={(value) => setFilters((prev) => ({ ...prev, limit: Number(value), page: 1 }))}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="10 / trang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50].map((size) => (
                                        <SelectItem key={size} value={size.toString()}>
                                            {size} / trang
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => setIsFilterOpen((prev) => !prev)}>
                                <Icon path={mdiFilterOutline} size={0.7} className="mr-2" />
                                {isFilterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                            </Button>
                        </div>
                    </div>

                    {isFilterOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Trạng thái hoạt động</p>
                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tất cả" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="active">Đang hoạt động</SelectItem>
                                        <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Thành phố</p>
                                <Input
                                    placeholder="Ví dụ: Hồ Chí Minh"
                                    value={filters.city || ''}
                                    onChange={(event) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            city: event.target.value || undefined,
                                            page: 1,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Quận / Huyện</p>
                                <Input
                                    placeholder="Ví dụ: Quận 1"
                                    value={filters.district || ''}
                                    onChange={(event) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            district: event.target.value || undefined,
                                            page: 1,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 space-y-3">
                            {[...Array(5)].map((_, index) => (
                                <Skeleton key={index} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <p className="text-red-500">Không thể tải danh sách cửa hàng</p>
                            <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['stores'] })}>
                                Thử lại
                            </Button>
                        </div>
                    ) : stores.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
                            <Icon path={mdiAlertCircleOutline} size={2} className="text-muted-foreground" />
                            <p className="text-lg font-semibold">Chưa có cửa hàng nào</p>
                            <p className="text-muted-foreground">Hãy tạo cửa hàng đầu tiên để bắt đầu quản lý.</p>
                            <Button onClick={openCreateForm} className="mt-2">
                                Thêm cửa hàng mới
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cửa hàng</TableHead>
                                        <TableHead>Liên hệ</TableHead>
                                        <TableHead>Quản lý</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Ngày khai trương</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stores.map((store) => (
                                        <TableRow key={store.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-maintext flex items-center gap-2">
                                                        <Icon path={mdiMapMarker} size={0.7} className="text-primary" />
                                                        {store.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{store.address}</p>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                                        {store.district && (
                                                            <Badge variant="outline" className="border-dashed text-maintext px-2 py-0.5">
                                                                {store.district}
                                                            </Badge>
                                                        )}
                                                        {store.city && (
                                                            <Badge className="bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 flex items-center gap-1">
                                                                <Icon path={mdiMapMarker} size={0.5} />
                                                                {store.city}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <p className="flex items-center gap-2">
                                                        <Icon path={mdiPhone} size={0.6} />
                                                        {store.phone}
                                                    </p>
                                                    {store.email && (
                                                        <p className="text-muted-foreground text-sm">{store.email}</p>
                                                    )}
                                                    {store.google_maps_url && (
                                                        <a
                                                            href={store.google_maps_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-semibold text-primary underline"
                                                        >
                                                            Xem bản đồ
                                                        </a>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {(store.manager_name || store.manager_id) && (
                                                    <p className="text-sm font-medium flex items-center gap-2">
                                                        <Icon path={mdiAccountTie} size={0.6} />
                                                        {store.manager_name || (store.manager_id ? `#${store.manager_id}` : 'Chưa cập nhật')}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge isActive={store.is_active} />
                                            </TableCell>
                                            <TableCell>
                                                {formatDateTime(store.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Chỉnh sửa"
                                                        onClick={() => openEditForm(store)}
                                                    >
                                                        <Icon path={mdiPencilOutline} size={0.7} />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Ngưng kích hoạt"
                                                        onClick={() => openDeleteDialog(store)}
                                                    >
                                                        <Icon path={mdiTrashCanOutline} size={0.7} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="py-4">
                                <Pagination>
                                    <PaginationContent>
                                        {currentPage > 1 ? (
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    handleChangePage(currentPage - 1);
                                                }}
                                            />
                                        ) : (
                                            <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
                                        )}

                                        {Array.from({ length: totalPages }).map((_, index) => {
                                            const pageNumber = index + 1;
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                Math.abs(pageNumber - currentPage) <= 1
                                            ) {
                                                return (
                                                    <PaginationItem key={pageNumber}>
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={pageNumber === currentPage}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                handleChangePage(pageNumber);
                                                            }}
                                                        >
                                                            {pageNumber}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            }
                                            if (
                                                pageNumber === currentPage - 2 ||
                                                pageNumber === currentPage + 2
                                            ) {
                                                return (
                                                    <PaginationItem key={`ellipsis-${pageNumber}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        })}

                                        {currentPage < totalPages ? (
                                            <PaginationNext
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    handleChangePage(currentPage + 1);
                                                }}
                                            />
                                        ) : (
                                            <PaginationNext href="#" className="pointer-events-none opacity-50" />
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{formMode === 'create' ? 'Thêm cửa hàng mới' : 'Cập nhật cửa hàng'}</DialogTitle>
                        <DialogDescription>
                            {formMode === 'create'
                                ? 'Tạo cửa hàng mới để quản lý tồn kho và nhân sự.'
                                : 'Cập nhật thông tin cửa hàng và trạng thái hoạt động.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmitForm)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên cửa hàng</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Techzone Quận 1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="manager_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã quản lý</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="VD: 5" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số điện thoại</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0909xxxxxx" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thành phố</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Hồ Chí Minh" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quận / Huyện</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Quận 1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa chỉ chi tiết</FormLabel>
                                        <FormControl>
                                            <Textarea rows={3} placeholder="Số 12, Nguyễn Huệ, Phường Bến Nghé..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Bật để cho phép cửa hàng xuất hiện trong các lựa chọn bán hàng.
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={createStoreMutation.isPending || updateStoreMutation.isPending}>
                                    <Icon path={mdiCheckCircle} size={0.6} className="mr-2" />
                                    {formMode === 'create' ? 'Tạo cửa hàng' : 'Lưu thay đổi'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Xác nhận ngưng hoạt động</DialogTitle>
                        <DialogDescription>
                            Cửa hàng sẽ được chuyển sang trạng thái không hoạt động (xóa mềm). Bạn có thể kích hoạt lại bất cứ lúc nào.
                        </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm">
                        Cửa hàng: <span className="font-semibold">{storeToDelete?.name}</span>
                    </p>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteStoreMutation.isPending}>
                            <Icon path={mdiTrashCanOutline} size={0.6} className="mr-2" />
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <StoreDetailDialog
                open={isDetailOpen}
                storeId={detailStoreId}
                onOpenChange={(open) => {
                    if (!open) {
                        setDetailStoreId(null);
                    }
                    setIsDetailOpen(open);
                }}
            />
        </div >
    );
}

