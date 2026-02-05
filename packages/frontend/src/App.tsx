import { AppLayout } from './layouts/AppLayout';

export const App = () => {
  return (
    <AppLayout>
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h2>
        <p className="text-gray-600">Select an influencer to view their offers.</p>
      </div>
    </AppLayout>
  );
};
