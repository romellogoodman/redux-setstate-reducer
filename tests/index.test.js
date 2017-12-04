import {hello} from '../src';

test('hello world', () => {
  const helloWorld = hello();

  expect(helloWorld).toEqual('hello world');
});
