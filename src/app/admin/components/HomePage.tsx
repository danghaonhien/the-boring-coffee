import React from 'react';
import { Product } from '../../../types/database.types';
import DashboardWidgets from './DashboardWidgets';

type ProductWithSales = Product & {
  sales?: number;
  salesRank?: 'top' | 'low' | null;
};

type HomePageProps = {
  dbProducts: ProductWithSales[];
  loading: boolean;
  connectionStatus: 'checking' | 'connected' | 'failed';
  collapsedWidgets: { [key: string]: boolean };
  toggleWidgetCollapse: (widget: string) => void;
  checkProducts: () => void;
  setMessage: (message: string) => void;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
};

const HomePage: React.FC<HomePageProps> = ({
  dbProducts,
  loading,
  connectionStatus,
  collapsedWidgets,
  toggleWidgetCollapse,
  checkProducts,
  setMessage,
  formatCurrency,
  formatNumber
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <DashboardWidgets 
        dbProducts={dbProducts}
        loading={loading}
        connectionStatus={connectionStatus}
        collapsedWidgets={collapsedWidgets}
        toggleWidgetCollapse={toggleWidgetCollapse}
        checkProducts={checkProducts}
        setMessage={setMessage}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
      />
    </div>
  );
};

export default HomePage; 