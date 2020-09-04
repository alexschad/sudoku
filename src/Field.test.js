import React from 'react';
import Field from './Field';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { sudokus } from './data';

test('it renders top left', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={0}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it renders top center', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={3}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it renders center left', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={18}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it renders center right', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={17}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it renders top right', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={8}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it renders top center', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={1}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it renders bottom left', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={72}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it renders bottom right', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={80}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it renders bottom center', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={73}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('test mouse events', () => {
  const component = renderer.create(
    <Field
    key={0}
    index={73}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={() => {}}
    showHints={false}
    mouseEnter={() => {}}
    mouseLeave={() => {}}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />,
  );
  let tree = component.toJSON();

  const mockEnterCallBack = jest.fn();
  const mockLeaveCallBack = jest.fn();
  const mockShowSelector = jest.fn();
  
  // mouse enter
  const field = shallow((<Field
    key={0}
    index={73}
    fields={sudokus[0]}
    sudokuIndex={0}
    showSelector={mockShowSelector}
    showHints={false}
    mouseEnter={mockEnterCallBack}
    mouseLeave={mockLeaveCallBack}
    highlight={true}
    errHighlight={false}
    errNumber={false}
    over={false}
  />));
  field.simulate('MouseEnter');
  expect(mockEnterCallBack.mock.calls.length).toEqual(1);

  field.simulate('mouseleave');
  expect(mockLeaveCallBack.mock.calls.length).toEqual(1);

  field.simulate('click');
  expect(mockShowSelector.mock.calls.length).toEqual(1);

});
