import React from 'react';
import renderer from 'react-test-renderer';
import NumberSelector from './NumberSelector';
import { sudokus } from './data';

test('it renders', () => {
  const component = renderer.create(
    <NumberSelector
    selectNumber={1}
    clicked={false}
    setClicked={() => {}}
    selPos={[0,0]}
    fields={sudokus[0]}
  />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});