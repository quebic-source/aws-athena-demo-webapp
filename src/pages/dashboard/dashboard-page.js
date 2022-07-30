import Header from '../../components/header/header';
import DashboardRouter from '../dashboard-router';

function DashboardPage() {
  return (
      <div className="h-screen flex flex-col">
          <Header/>
          <DashboardRouter />
      </div>
  );
}

export default DashboardPage;
