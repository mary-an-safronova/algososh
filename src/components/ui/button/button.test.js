import renderer from "react-test-renderer";
import { Button } from "./button";
import {render, screen, fireEvent} from "@testing-library/react";

describe('Button', () => {
    it('should renders correctly Button with text', () => {
        const tree = renderer.create(<Button text="testing text" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Button without text', () => {
        const tree = renderer.create(<Button />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Button with disabled', () => {
        const tree = renderer.create(<Button disabled={true} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Button with loader', () => {
        const tree = renderer.create(<Button isLoader={true} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should renders correctly Button event click", () => {
        const mockFn = jest.fn();
        render(<Button text="Button onClick" onClick={mockFn} />);
        const button = screen.getByText("Button onClick");
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    });
});
