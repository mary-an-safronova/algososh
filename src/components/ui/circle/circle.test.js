import renderer from "react-test-renderer";
import { Circle } from "./circle";
import { ElementStates } from "../../../types/types";

describe('Circle', () => {
    it('should renders correctly Circle without letter', () => {
        const tree = renderer.create(<Circle />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle with letters', () => {
        const tree = renderer.create(<Circle letter="abc" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle with head', () => {
        const tree = renderer.create(<Circle head="head" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle with react element in the head', () => {
        const tree = renderer.create(<Circle isSmall={true} extraClass="topCircle" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle with tail', () => {
        const tree = renderer.create(<Circle tail="tail" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle with react element in the tail', () => {
        const tree = renderer.create(<Circle isSmall={true} extraClass="bottomCircle" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle with index', () => {
        const tree = renderer.create(<Circle index={1} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle with prop "isSmall"', () => {
        const tree = renderer.create(<Circle isSmall={true} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle in state "default"', () => {
        const tree = renderer.create(<Circle state={ElementStates.Default} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle in state "changing"', () => {
        const tree = renderer.create(<Circle state={ElementStates.Changing} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should renders correctly Circle in state "modified"', () => {
        const tree = renderer.create(<Circle state={ElementStates.Modified} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});