import * as React from 'react';
import cn from 'classnames';
import styles from './ExpandablePanel.scss';

type CSSClasses = 'wrapper' | 'header' | 'content';
type Classes = Partial<Record<CSSClasses, string>>;

interface Props {
  text: string | React.ReactNode;
  children: React.ReactNode;

  defaultExpanded?: boolean;
  expanded?: boolean;

  icon?: string;
  iconRenderer?: React.ReactNode;

  hasTrigger?: boolean;
  triggerRenderer?: React.ReactNode;

  classes?: Classes;

  asyncContent?: boolean;

  onChange?: (event: React.MouseEvent, expanded: boolean) => void;
}

interface State {
  isExpanded: boolean;
  contentHeight: number | string;
}

export class ExpandablePanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: !!props.defaultExpanded || !!props.expanded,
      contentHeight: props.defaultExpanded ? 'auto' : 0,
    };
  }

  private content = React.createRef<HTMLDivElement>();

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevState.contentHeight === 'auto' &&
      this.state.contentHeight !== 'auto'
    ) {
      setTimeout(() => this.setState({ contentHeight: 0 }), 1);
    }
  }

  clickHandler = (event: React.MouseEvent) => {
    const { onChange, expanded } = this.props;
    this.setState(
      state => ({
        isExpanded: expanded === undefined ? !state.isExpanded : expanded,
        contentHeight:
          this.content.current && this.content.current.scrollHeight,
      }),
      () => onChange && onChange(event, this.state.isExpanded),
    );
  };

  updateAfterTransition = () => {
    if (this.state.isExpanded) {
      this.setState({ contentHeight: 'auto' });
    }
  };

  render() {
    const {
      children,
      icon,
      iconRenderer,
      text,
      triggerRenderer,
      classes = {},
      hasTrigger = true,
    } = this.props;
    const { isExpanded, contentHeight } = this.state;
    const { wrapper, header, content } = classes;

    return (
      <div className={cn(styles.wrapper, { [wrapper]: wrapper })}>
        <div
          className={cn(styles.header, { [header]: header })}
          onClick={this.clickHandler}
        >
          <div className={styles.iconContainer}>
            {iconRenderer ||
              (icon && <div className={cn(styles.icon, icon)} />)}
            <div className={styles.text}>{text}</div>
          </div>
          {triggerRenderer ||
            (hasTrigger && (
              <div
                className={cn(styles.trigger, 'icon-cevron-down', {
                  [styles.isOpened]: isExpanded,
                })}
              />
            ))}
        </div>

        <div
          ref={this.content}
          onTransitionEnd={() => this.updateAfterTransition()}
          style={{ height: contentHeight }}
          className={cn(styles.content, { [content]: content })}
        >
          <div>{children}</div>
        </div>
      </div>
    );
  }
}
