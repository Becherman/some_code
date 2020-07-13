import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ExpandablePanel } from './ExpandablePanel';

describe('[Components] => <ExpandablePanel />', () => {
  let wrapper: ShallowWrapper;
  const props = {
    text: 'foo',
    onChange: jest.fn(),
    defaultExpanded: false,
    classes: {
      wrapper: 'foo',
      header: 'bar',
      content: 'baz',
    },
  };

  beforeEach(() => {
    wrapper = shallow(
      <ExpandablePanel {...props}>
        <div className="child"></div>
      </ExpandablePanel>,
    );

    props.onChange.mockClear();
  });

  it('renders without errors', () => {
    expect(wrapper.find('.wrapper').exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('adds a user classname to wrapper', () => {
    expect(wrapper.find('.wrapper').hasClass('foo')).toBe(true);
  });

  it('expanded by default if defaultExpanded prop was passed', () => {
    const wrapper = shallow(
      <ExpandablePanel {...props} defaultExpanded>
        <div className="child"></div>
      </ExpandablePanel>,
    );

    expect(wrapper.state('isExpanded')).toBe(true);
  });

  it('triggers onChange handler on every expand/collapse', () => {
    wrapper.find('.header').simulate('click');

    expect(props.onChange).toBeCalledWith(undefined, true);
  });

  it('becomes fully controllable component and ignore regular open/close mechanism', () => {
    const wrapper = shallow(
      <ExpandablePanel {...props} expanded>
        <div className="child"></div>
      </ExpandablePanel>,
    );

    expect(wrapper.state('isExpanded')).toBe(true);
    wrapper.find('.header').simulate('click');
    expect(wrapper.state('isExpanded')).toBe(true);
  });

  it('should consider defaultExpanded with more priority then expandede prop', () => {
    const wrapper = shallow(
      <ExpandablePanel {...props} expanded={false} defaultExpanded>
        <div className="child"></div>
      </ExpandablePanel>,
    );

    expect(wrapper.state('isExpanded')).toBe(true);
  });

  describe('Header', () => {
    it('renders header', () => {
      expect(wrapper.find('.header').exists()).toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });

    // Trigger
    it('renders trigger element by default', () => {
      expect(wrapper.find('.trigger').exists()).toBeTruthy();
    });

    it('renders passed triggerRenderer component instead of a basic trigger', () => {
      const wrapper = shallow(
        <ExpandablePanel
          {...props}
          triggerRenderer={<div className="triggerRenderer" />}
        >
          <div className="child"></div>
        </ExpandablePanel>,
      );

      expect(wrapper.find('.trigger').exists()).toBeFalsy();
      expect(wrapper.find('.triggerRenderer').exists()).toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });

    it('should add .isOpened class to trigger on click', () => {
      expect(wrapper.find('.trigger').hasClass('isOpened')).toBe(false);
      wrapper.find('.header').simulate('click');
      expect(wrapper.find('.trigger').hasClass('isOpened')).toBe(true);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders trigger if hasTrigger prop was passed', () => {
      expect(wrapper.find('.trigger').exists()).toBe(true);
      wrapper.setProps({ hasTrigger: false });
      expect(wrapper.find('.trigger').exists()).toBe(false);
      expect(wrapper).toMatchSnapshot();
    });

    // Icon
    it('renders icon if icon prop was passed', () => {
      expect(wrapper.find('.icon').exists()).toBe(false);
      wrapper.setProps({ icon: 'foobar' });
      expect(wrapper.find('.icon').exists()).toBe(true);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders passed iconRenderer component instead of a basic icon', () => {
      const wrapper = shallow(
        <ExpandablePanel
          {...props}
          triggerRenderer={<div className="iconRenderer" />}
        >
          <div className="child"></div>
        </ExpandablePanel>,
      );

      expect(wrapper.find('.icon').exists()).toBeFalsy();
      expect(wrapper.find('.iconRenderer').exists()).toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });

    //Text
    it('renders passed text prop', () => {
      expect(wrapper.find('.text').text()).toBe(props.text);
      expect(wrapper).toMatchSnapshot();
    });
  });

  // Content
  describe('Content', () => {
    it('renders content block', () => {
      expect(wrapper.find('.content').exists()).toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });

    it('renders passed child', () => {
      expect(wrapper.find('.child').exists()).toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });

    it('adds custom styles to content', () => {
      expect(wrapper.find('.content').hasClass('baz')).toBe(true);
    });
  });
});
