import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Drawer } from './Drawer';

const Component = () => <div></div>;

describe('[Components] => Drawer', () => {
  it('should render without errors', () => {
    const wrapper = shallow(
      <Drawer sidebar={() => <Component />} main={() => <Component />} />,
    );

    expect(wrapper.find('.drawer').children()).toHaveLength(3);
  });

  it('should render a sidebar, main content section and a backdrop', () => {
    const wrapper = shallow(
      <Drawer sidebar={() => <Component />} main={() => <Component />} />,
    );

    expect(wrapper.find('.sidebar').exists()).toBe(true);
    expect(wrapper.find('.main').exists()).toBe(true);
    expect(wrapper.find('.backdrop').exists()).toBe(true);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should update a classnames after clicking on a backdrop', () => {
    const wrapper = shallow(
      <Drawer sidebar={() => <Component />} main={() => <Component />} />,
    );
    const backdrop = wrapper.find('.backdrop');

    expect(wrapper.find('.mobileSidebar').hasClass('sidebarIsOpen')).toBe(
      false,
    );
    expect(toJson(wrapper)).toMatchSnapshot();

    backdrop.simulate('click');

    expect(wrapper.find('.mobileSidebar').hasClass('sidebarIsOpen')).toBe(true);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should update class names when the state will change', () => {
    const wrapper = shallow(
      <Drawer sidebar={() => <Component />} main={() => <Component />} />,
    );

    expect(wrapper.find('.mobileSidebar').hasClass('sidebarIsOpen')).toBe(
      false,
    );
    expect(wrapper.find('.backdrop').hasClass('backdropIsOpen')).toBe(false);
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.setState({ sidebarIsOpen: true });

    expect(wrapper.find('.mobileSidebar').hasClass('sidebarIsOpen')).toBe(true);
    expect(wrapper.find('.backdrop').hasClass('backdropIsOpen')).toBe(true);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
