import React from "react";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { PostComment } from "./PostComment";

Enzyme.configure({ adapter: new Adapter() });

describe("<PostComment />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PostComment />);
  });

  it("should disable the button when loading is true", () => {
    wrapper.setProps({
      loading: true
    });

    wrapper.setState({
      comments: "This is a valid comment"
    });

    expect(wrapper.find("button[disabled=true]"));
  });
});
