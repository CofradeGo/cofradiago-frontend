import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import EmptyState from "../../components/ui/EmptyState";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <EmptyState message="Dashboard en construcción" />
    </DashboardLayout>
  );
};

export default Dashboard;
