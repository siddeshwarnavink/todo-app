import React from "react";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Comments } from "./Comments";
import Spinner from "../UI/Spinner/Spinner";
import CommentMessage from "./CommentMessage/CommentMessage";

Enzyme.configure({ adapter: new Adapter() });

describe("<Comments />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Comments />);
  });

  it("should render <Spinner /> when loading is true", () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });

  it("should render a <CommentMessage /> on passing prop", () => {
    const comments = [
      {
        created_at: "2019-03-24 17:25:52",
        message: "Hello world",
        creator: {
          id: 7,
          username: "Siddeshwar"
        }
      }
    ];

    wrapper.setProps({
      loading: false,
      comments: [...comments]
    });

    expect(wrapper.find(CommentMessage)).toHaveLength(1);
  });
});
