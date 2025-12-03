'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import {
  mdiCashMultiple,
  mdiPackageVariantClosed,
  mdiAccountGroup,
  mdiTrendingUp,
  mdiStore,
  mdiChartDonut,
  mdiClipboardTextClock,
} from '@mdi/js';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  useRevenueByStore,
  useRevenueByCategory,
  useRevenueOverTime,
  useDashboard,
  useCostReport,
  useExportReport,
  useInventoryByStore,
  useLowStock,
  useInventoryLogs,
  useCustomers,
  useCustomerDetail,
  useOrdersByStatus,
  useReviewsStats,
  useProfitReport,
} from '@/hooks/statistics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const MOCK_REVENUE_SERIES = [
  { period: 'Tuần 1', revenue: 150000000, orders: 420 },
  { period: 'Tuần 2', revenue: 185000000, orders: 460 },
  { period: 'Tuần 3', revenue: 210000000, orders: 510 },
  { period: 'Tuần 4', revenue: 198000000, orders: 495 },
  { period: 'Tuần 5', revenue: 230000000, orders: 540 },
  { period: 'Tuần 6', revenue: 245000000, orders: 560 },
  { period: 'Tuần 7', revenue: 260000000, orders: 580 },
];
const MOCK_TOP_PRODUCTS = [
  { name: 'ASUS ROG', total_sold: 320, revenue: 980000000 },
  { name: 'MSI Gaming', total_sold: 290, revenue: 820000000 },
  { name: 'Gigabyte Aorus', total_sold: 270, revenue: 760000000 },
  { name: 'Lenovo Legion', total_sold: 250, revenue: 720000000 },
  { name: 'Acer Predator', total_sold: 230, revenue: 690000000 },
  { name: 'Alienware', total_sold: 210, revenue: 870000000 },
  { name: 'HP Omen', total_sold: 195, revenue: 640000000 },
  { name: 'Dell XPS', total_sold: 180, revenue: 610000000 },
  { name: 'Razer', total_sold: 170, revenue: 660000000 },
  { name: 'NZXT', total_sold: 160, revenue: 520000000 },
];

const TABLE_WRAPPER_CLASS = 'overflow-hidden rounded-xl border border-slate-300 bg-white shadow-md';
const TABLE_ROW_CLASS = 'text-maintext odd:bg-slate-50/70 hover:bg-slate-100 transition-colors';
const TABLE_HEADER_CELL_CLASS = 'bg-slate-50 text-slate-600 font-semibold uppercase tracking-wide text-xs';

const normalizeToArray = <T,>(data: T | T[] | null | undefined): T[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
    return [data as T];
  }

  return [];
};

const toNumberValue = (value: number | string | null | undefined): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  iconBg: string;
  cardBg: string;
  change: number;
}

const StatCard = ({ title, value, icon, iconColor, iconBg, cardBg, change }: StatCardProps) => {
  return (
    <Card className={`h-full border-none shadow-lg text-white ${cardBg}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-white/80">{title}</p>
            <h3 className="text-3xl font-semibold mt-2 leading-tight">{value}</h3>
            <div className="flex items-center mt-3">
              <Icon
                path={mdiTrendingUp}
                size={0.8}
                className={change >= 0 ? 'text-white' : 'text-rose-100'}
              />
              <span className={`text-sm ml-1 ${change >= 0 ? 'text-white' : 'text-rose-100'}`}>
                {Math.abs(change).toFixed(1)}% {change >= 0 ? 'tăng' : 'giảm'}
              </span>
            </div>
          </div>
          <div
            className={`${iconBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur`}
          >
            <Icon path={icon} size={1} className={iconColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'products' | 'statistics'>(
    'overview',
  );
  const [selectedStoreId] = useState<number | undefined>(1);

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useDashboard({});
  const {
    data: profitReportData,
    isLoading: profitLoading,
    isError: profitError,
  } = useProfitReport({ store_id: selectedStoreId, period: 'month' });

  const {
    data: revenueOverTimeData,
    isLoading: revenueOverTimeLoading,
    isError: revenueOverTimeError,
  } = useRevenueOverTime({ period: 'day' });

  const { data: revenueByStoreData } = useRevenueByStore({});
  const { data: revenueByCategoryData } = useRevenueByCategory({});
  const { data: costReportData, isLoading: costLoading } = useCostReport({
    store_id: selectedStoreId,
    period: 'month',
  });
  const { data: exportSalesData } = useExportReport({
    report_type: 'sales',
    store_id: selectedStoreId,
  });
  const { data: exportInventoryData } = useExportReport({
    report_type: 'inventory',
    store_id: selectedStoreId,
  });

  const {
    data: inventoryByStoreData,
    isLoading: inventoryLoading,
  } = useInventoryByStore({ store_id: selectedStoreId!, page: 1, limit: 5 });
  const { data: lowStockData } = useLowStock({ store_id: selectedStoreId! });
  const { data: inventoryLogsData } = useInventoryLogs({ store_id: selectedStoreId, limit: 5 });

  const { data: customersData } = useCustomers({ page: 1, limit: 5 });
  const customersList = normalizeToArray(customersData?.data);
  const firstCustomerId = customersList[0]?.id;
  const { data: customerDetailData } = useCustomerDetail(firstCustomerId || '');

  const { data: ordersByStatusData } = useOrdersByStatus({ store_id: selectedStoreId });
  const { data: reviewsStatsData } = useReviewsStats({});

  const totalRevenue = toNumberValue(dashboardData?.data?.total_revenue);
  const totalOrders = toNumberValue(dashboardData?.data?.total_orders);
  const newCustomersCount = toNumberValue(dashboardData?.data?.new_customers);

  const profitTotals = profitReportData?.data.totals;
  const currentMonthProfit = toNumberValue(profitTotals?.total_profit);

  const revenueOverTimeSource = Array.isArray(revenueOverTimeData?.data)
    ? revenueOverTimeData?.data
    : Array.isArray((revenueOverTimeData as any)?.data?.data)
      ? (revenueOverTimeData as any).data.data
      : revenueOverTimeData?.data;

  const revenueOverTimeRaw = normalizeToArray(revenueOverTimeSource);

  const revenueSeries =
    revenueOverTimeRaw.map((item: any) => ({
      period: item.period,
      revenue: toNumberValue(item.revenue),
      orders: toNumberValue(item.orders),
    })) || [];
  console.log("revenueSeries", revenueOverTimeData);

  const topProductsRaw = dashboardData?.data?.top_products;
  const topProductsFromDashboard = normalizeToArray(topProductsRaw).map((item: any) => ({
    ...item,
    total_sold: toNumberValue(item.total_sold),
    revenue: toNumberValue(item.revenue),
  }));

  const revenueChartData = MOCK_REVENUE_SERIES;
  const topProductsChartData = MOCK_TOP_PRODUCTS;

  const revenueByStoreList = normalizeToArray(revenueByStoreData?.data);
  const revenueByCategoryList = normalizeToArray(revenueByCategoryData?.data);
  const costSummaryList = normalizeToArray(costReportData?.data?.summary);
  const inventoryByStoreList = normalizeToArray(inventoryByStoreData?.data);
  const lowStockList = normalizeToArray(lowStockData?.data);
  const inventoryLogsList = normalizeToArray(inventoryLogsData?.data);
  const ordersByStatusList = normalizeToArray(ordersByStatusData?.data);

  const totalRevenueFromSeries = revenueChartData.reduce((sum, item) => sum + toNumberValue(item.revenue), 0);
  const totalOrdersFromSeries = revenueChartData.reduce((sum, item) => sum + toNumberValue(item.orders), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thống kê</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-6xl">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê chi tiết</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {dashboardLoading || profitLoading || revenueOverTimeLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : dashboardError || revenueOverTimeError || profitError ? (
            <Card className="p-4">
              <p className="text-red-600">Lỗi khi tải dữ liệu thống kê</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <StatCard
                title="Tổng doanh thu"
                value={formatCurrency(totalRevenue)}
                icon={mdiCashMultiple}
                iconColor="text-white"
                iconBg="bg-emerald-400/30"
                cardBg="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700"
                change={0}
              />
              <StatCard
                title="Số đơn hàng"
                value={totalOrders.toString()}
                icon={mdiPackageVariantClosed}
                iconColor="text-white"
                iconBg="bg-sky-400/30"
                cardBg="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700"
                change={5.3}
              />
              <StatCard
                title="Lợi nhuận"
                value={formatCurrency(currentMonthProfit)}
                icon={mdiTrendingUp}
                iconColor="text-white"
                iconBg="bg-fuchsia-400/30"
                cardBg="bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700"
                change={7.8}
              />
              <StatCard
                title="Khách hàng mới"
                value={newCustomersCount.toString()}
                icon={mdiAccountGroup}
                iconColor="text-white"
                iconBg="bg-amber-400/30"
                cardBg="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
                change={3.2}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Doanh thu theo thời gian</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 thương hiệu bán chạy</CardTitle>
              </CardHeader>
              <CardContent className="!p-2">
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topProductsChartData.slice(0, 5).map((item) => ({
                          name:
                            item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name,
                          fullName: item.name,
                          quantity: item.total_sold,
                          revenue: item.revenue,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        dataKey="quantity"
                        label={({ name, percent }: { name: string; percent: number }) =>
                          percent > 0.05 ? `${name}: ${(percent * 100).toFixed(1)}%` : ''
                        }
                        labelLine={false}
                      >
                        {topProductsChartData.slice(0, 5).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                          `${value} sản phẩm`,
                          props.payload.fullName || name,
                        ]}
                        labelFormatter={() => 'Sản phẩm bán chạy'}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Báo cáo doanh thu</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="p-4 bg-slate-50 rounded-md mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-maintext">Tổng doanh thu (series)</h3>
                    <p className="text-2xl font-bold text-green-500 mt-2">
                      {formatCurrency(totalRevenueFromSeries)}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-maintext">Số đơn hàng (series)</h3>
                    <p className="text-2xl font-bold mt-2 text-blue-500">
                      {totalOrdersFromSeries}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Doanh thu theo chi nhánh</h3>
                  <div className={TABLE_WRAPPER_CLASS}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={TABLE_HEADER_CELL_CLASS}>Chi nhánh</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Doanh thu</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Số đơn</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {revenueByStoreList.map((s) => (
                          <TableRow key={s.id} className={TABLE_ROW_CLASS}>
                            <TableCell>{s.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(toNumberValue(s.revenue))}</TableCell>
                            <TableCell className="text-right">{s.order_count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Doanh thu theo danh mục</h3>
                  <div className={TABLE_WRAPPER_CLASS}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={TABLE_HEADER_CELL_CLASS}>Danh mục</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Doanh thu</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>SL bán</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {revenueByCategoryList.map((c) => (
                          <TableRow key={c.id} className={TABLE_ROW_CLASS}>
                            <TableCell>{c.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(toNumberValue(c.revenue))}</TableCell>
                            <TableCell className="text-right">{c.quantity_sold}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi phí & xuất báo cáo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-maintext mb-2">Chi phí nhập hàng (tóm tắt)</h3>
                {costLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className={TABLE_WRAPPER_CLASS}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={TABLE_HEADER_CELL_CLASS}>Giai đoạn</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Chi phí</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>SL phiếu nhập</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costSummaryList.slice(0, 5).map((item, index) => (
                          <TableRow key={item.period + item.store_id} className={TABLE_ROW_CLASS}>
                            <TableCell>{item.period}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(toNumberValue(item.total_cost))}
                            </TableCell>
                            <TableCell className="text-right">{item.purchase_count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-maintext mb-2">Một vài đơn từ báo cáo xuất</h3>
                <div className={TABLE_WRAPPER_CLASS}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={TABLE_HEADER_CELL_CLASS}>Mã đơn</TableHead>
                        <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Tổng tiền</TableHead>
                        <TableHead className={TABLE_HEADER_CELL_CLASS}>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exportSalesData &&
                        'orders' in exportSalesData.data &&
                        exportSalesData.data.orders.slice(0, 5).map((o) => (
                          <TableRow key={o.id} className={TABLE_ROW_CLASS}>
                            <TableCell>{o.id}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(toNumberValue(o.total_amount))}
                            </TableCell>
                            <TableCell>{o.status}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 text-maintext">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="w-full h-80 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topProductsChartData.slice(0, 10).map((item) => ({
                        name:
                          item.name.length > 20
                            ? `${item.name.substring(0, 20)}...`
                            : item.name,
                        fullName: item.name,
                        quantity: item.total_sold,
                        revenue: item.revenue,
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      dataKey="quantity"
                      label={({ name, percent }: { name: string; percent: number }) =>
                        percent > 0.05 ? `${name}: ${(percent * 100).toFixed(1)}%` : ''
                      }
                      labelLine={false}
                    >
                      {topProductsChartData.slice(0, 10).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value} sản phẩm`,
                        props.payload.fullName || name,
                      ]}
                      labelFormatter={() => 'Sản phẩm bán chạy'}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-sky-100 shadow-md text-sky-900">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm uppercase tracking-wide text-sky-500 font-semibold">Tổng số lượng bán</h4>
                      <p className="text-3xl font-bold mt-2">
                        {topProductsChartData.reduce((sum, item) => sum + item.total_sold, 0)}{' '}
                        <span className="text-base font-medium text-sky-600">sản phẩm</span>
                      </p>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-sky-200/70 flex items-center justify-center">
                      <Icon path={mdiPackageVariantClosed} size={0.9} className="text-sky-600" />
                    </span>
                  </div>
                  <p className="text-xs text-sky-500 mt-2">Dữ liệu tổng hợp từ danh sách thương hiệu bán chạy</p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 shadow-md text-emerald-900">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm uppercase tracking-wide text-emerald-500 font-semibold">Tổng doanh thu</h4>
                      <p className="text-3xl font-bold mt-2">
                        {formatCurrency(topProductsChartData.reduce((sum, item) => sum + toNumberValue(item.revenue), 0))}
                      </p>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-emerald-200/70 flex items-center justify-center">
                      <Icon path={mdiCashMultiple} size={0.9} className="text-emerald-600" />
                    </span>
                  </div>
                  <p className="text-xs text-emerald-500 mt-2">Giá trị quy đổi tổng theo đơn vị VNĐ</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className={TABLE_WRAPPER_CLASS}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={TABLE_HEADER_CELL_CLASS}>Tên sản phẩm</TableHead>
                        <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Số lượng bán</TableHead>
                        <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Doanh thu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProductsChartData.map((item, index) => (
                        <TableRow key={index} className={TABLE_ROW_CLASS}>
                          <TableCell className="font-medium text-maintext">{item.name}</TableCell>
                          <TableCell className="text-right text-maintext">{item.total_sold}</TableCell>
                          <TableCell className="text-right text-maintext">
                            {formatCurrency(toNumberValue(item.revenue))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Khách hàng & đánh giá sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <h3 className="font-semibold text-maintext mb-2">Khách hàng gần đây</h3>
                  <div className={TABLE_WRAPPER_CLASS}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={TABLE_HEADER_CELL_CLASS}>Tên</TableHead>
                          <TableHead className={TABLE_HEADER_CELL_CLASS}>Email</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Tổng chi tiêu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customersList.map((c) => (
                          <TableRow key={c.id} className={TABLE_ROW_CLASS}>
                            <TableCell className="text-maintext">{c.full_name}</TableCell>
                            <TableCell className="text-maintext">{c.email}</TableCell>
                            <TableCell className="text-right text-maintext">
                              {formatCurrency(toNumberValue(c.total_spent))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-maintext mb-2">Thống kê đánh giá</h3>
                    <p className="text-sm">
                      Tổng đánh giá:{' '}
                      <span className="font-semibold">
                        {reviewsStatsData?.data.summary.total_reviews || 0}
                      </span>
                    </p>
                    <p className="text-sm">
                      Điểm trung bình:{' '}
                      <span className="font-semibold">
                        {reviewsStatsData?.data.summary.avg_rating || '0.00'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {customerDetailData && (
                <div className="mt-4 p-4 bg-slate-50 rounded-md text-sm">
                  <h3 className="font-semibold text-maintext mb-2">Chi tiết khách hàng nổi bật</h3>
                  <p>
                    {customerDetailData.data.full_name} -{' '}
                    <span className="text-maintext">{customerDetailData.data.email}</span>
                  </p>
                  <p>
                    Tổng chi tiêu:{' '}
                    <span className="font-semibold">
                      {formatCurrency(toNumberValue(customerDetailData.data.total_spent))}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4 text-maintext">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Đơn hàng theo trạng thái & lợi nhuận</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon path={mdiClipboardTextClock} size={0.8} />
                      Đơn hàng theo trạng thái
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={TABLE_WRAPPER_CLASS}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className={TABLE_HEADER_CELL_CLASS}>Trạng thái</TableHead>
                            <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Số đơn</TableHead>
                            <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Doanh thu</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ordersByStatusList.map((item) => (
                            <TableRow key={item.status} className={TABLE_ROW_CLASS}>
                              <TableCell className="uppercase">{item.status}</TableCell>
                              <TableCell className="text-right">{item.count}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(toNumberValue(item.revenue))}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon path={mdiChartDonut} size={0.8} />
                      Tổng quan lợi nhuận
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {profitLoading && <Skeleton className="h-24 w-full" />}
                    {profitError && (
                      <p className="text-red-600 text-sm">Không thể tải dữ liệu lợi nhuận</p>
                    )}
                    {profitTotals && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-maintext">Tổng doanh thu</p>
                          <p className="font-semibold">
                            {formatCurrency(toNumberValue(profitTotals.total_revenue))}
                          </p>
                        </div>
                        <div>
                          <p className="text-maintext">Tổng chi phí</p>
                          <p className="font-semibold">
                            {formatCurrency(toNumberValue(profitTotals.total_cost))}
                          </p>
                        </div>
                        <div>
                          <p className="text-maintext">Tổng lợi nhuận</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(toNumberValue(profitTotals.total_profit))}
                          </p>
                        </div>
                        <div>
                          <p className="text-maintext">Biên lợi nhuận</p>
                          <p className="font-semibold">{profitTotals.total_profit_margin}%</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Kho hàng & sản phẩm cần nhập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-maintext flex items-center gap-2">
                      <Icon path={mdiStore} size={0.8} />
                      Tồn kho theo chi nhánh
                    </h3>
                  </div>
                  {inventoryLoading ? (
                    <Skeleton className="h-40 w-full" />
                  ) : (
                    <div className={TABLE_WRAPPER_CLASS}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className={TABLE_HEADER_CELL_CLASS}>Sản phẩm</TableHead>
                            <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>SL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventoryByStoreList.slice(0, 5).map((item) => (
                            <TableRow key={item.id} className={TABLE_ROW_CLASS}>
                              <TableCell className="text-maintext">{item.name}</TableCell>
                              <TableCell className="text-right text-maintext">
                                {item.quantity}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-maintext mb-2">Sản phẩm cần nhập kho</h3>
                  <div className={TABLE_WRAPPER_CLASS}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={TABLE_HEADER_CELL_CLASS}>Sản phẩm</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Tồn kho</TableHead>
                          <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Ngưỡng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lowStockList.slice(0, 5).map((item) => (
                          <TableRow key={item.id} className={TABLE_ROW_CLASS}>
                            <TableCell className="text-maintext">{item.name}</TableCell>
                            <TableCell className="text-right text-maintext">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right text-maintext">
                              {item.reorder_level}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-maintext mb-2">Nhật ký nhập/xuất gần đây</h3>
                <div className={TABLE_WRAPPER_CLASS}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={TABLE_HEADER_CELL_CLASS}>Thời gian</TableHead>
                        <TableHead className={TABLE_HEADER_CELL_CLASS}>Sản phẩm</TableHead>
                        <TableHead className={TABLE_HEADER_CELL_CLASS}>Loại</TableHead>
                        <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Số lượng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryLogsList.slice(0, 5).map((log) => (
                        <TableRow key={log.id} className={TABLE_ROW_CLASS}>
                          <TableCell>{formatDate(log.created_at)}</TableCell>
                          <TableCell>{log.product_name}</TableCell>
                          <TableCell className="uppercase">{log.type}</TableCell>
                          <TableCell className="text-right">{log.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-maintext mb-2">Một vài dòng từ báo cáo tồn kho</h3>
                <div className={TABLE_WRAPPER_CLASS}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={TABLE_HEADER_CELL_CLASS}>Sản phẩm</TableHead>
                        <TableHead className={TABLE_HEADER_CELL_CLASS}>Chi nhánh</TableHead>
                        <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Tồn kho</TableHead>
                        <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Ngưỡng</TableHead>
                        <TableHead className={`${TABLE_HEADER_CELL_CLASS} text-right`}>Giá trị tồn</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exportInventoryData &&
                        'inventory' in exportInventoryData.data &&
                        exportInventoryData.data.inventory.slice(0, 5).map((item) => (
                          <TableRow key={item.id} className={TABLE_ROW_CLASS}>
                            <TableCell className="text-maintext">{item.name}</TableCell>
                            <TableCell className="text-maintext">{item.store_name}</TableCell>
                            <TableCell className="text-right text-maintext">{item.quantity}</TableCell>
                            <TableCell className="text-right text-maintext">
                              {item.reorder_level}
                            </TableCell>
                            <TableCell className="text-right text-maintext">
                              {formatCurrency(toNumberValue(item.inventory_value))}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
