import React from 'react';
import { Text, Layout } from '@wings-software/uikit';

interface AppErrorBoundaryState {
  error?: Error;
}

class AppErrorBoundary extends React.Component<{}, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: undefined };

  componentDidCatch(error: Error) {
    this.setState({ error });
    return false;
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <Layout.Vertical spacing="medium">
          <Text>Something went wrong...</Text>
          <Text>This error has been reported and we are looking into it with high priority.</Text>
          <Text>
            Please{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                window.location.reload();
              }}
            >
              refresh
            </a>{' '}
            your browser to continue.
          </Text>
          {__DEV__ && (
            <React.Fragment>
              <Text font="small">{error.message}</Text>
              <Text>
                <details>
                  <summary>Stack trace</summary>
                  <pre>{error.stack}</pre>
                </details>
              </Text>
            </React.Fragment>
          )}
        </Layout.Vertical>
      );
    }

    return React.Children.only(this.props.children);
  }
}

export default AppErrorBoundary;
