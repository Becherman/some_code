import * as React from 'react';
import classNames from 'classnames';

import styles from './Drawer.scss';

interface Props {
  sidebar(sidebarHandler: () => void): React.ReactNode;
  main(sidebarHandler: () => void): React.ReactNode;
}

interface State {
  sidebarIsOpen: boolean;
}
export class Drawer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sidebarIsOpen: false,
    };
  }

  toggleSidebar = (): void => {
    this.setState(state => ({
      sidebarIsOpen: !state.sidebarIsOpen,
    }));
  };

  render() {
    const { sidebar, main } = this.props;
    const { sidebarIsOpen } = this.state;

    return (
      <div className={styles.drawer}>
        {/** Backdrop */}
        <div
          onClick={this.toggleSidebar}
          className={classNames({
            [styles.backdrop]: true,
            [styles.backdropIsOpen]: sidebarIsOpen,
          })}
        />

        {/** Mobile Sidebar */}
        <div
          className={classNames({
            [styles.mobileSidebar]: true,
            [styles.sidebarIsOpen]: sidebarIsOpen,
          })}
        >
          {sidebar(this.toggleSidebar)}
        </div>

        <div className={styles.layout}>
          {/** Desktop Sidebar */}
          <div className={styles.sidebar}>{sidebar(this.toggleSidebar)}</div>

          {/** Main Content */}
          <div className={styles.main}>{main(this.toggleSidebar)}</div>
        </div>
      </div>
    );
  }
}
