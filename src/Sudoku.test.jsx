import React from 'react';
import renderer from 'react-test-renderer';
import Sudoku from './Sudoku';

test('it renders', () => {
  const component = renderer.create(
    <Sudoku />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});