import React from 'react';

type LoginPageProps = {
  error?: string;
};

const LoginPage: React.FC<LoginPageProps> = ({ error }) => {
  return (
    <div>
      <h1>Login Page</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default LoginPage;