import {
  ACTION_TYPE,
  createOptions,
  createReducer,
  createType,
  defaultSetState,
  executeAction,
  setState
} from '../src/lib';

const testDefaultOptions = {
  initialState: {},
  setState: null,
  type: ''
};

test('ACTION_TYPE, should never change', () => {
  expect(ACTION_TYPE).toEqual('SETSTATE_MW');
});

test('createOptions, should returnd default options', () => {
  const options = createOptions();
  const expectedOptions = testDefaultOptions;

  expect(options).toEqual(expectedOptions);
});

test('createOptions, should merge options', () => {
  const customOptions = {initialState: {hello: 'world'}, custom: 'key'};
  const options = createOptions(customOptions);
  const expectedOptions = {
    ...testDefaultOptions,
    ...customOptions
  };

  expect(options).toEqual(expectedOptions);
});

test('createReducer, option initialState', () => {
  const options = {
    initialState: {hello: 'world'}
  };
  const reducer = createReducer(options);

  expect(reducer()).toEqual(options.initialState);
});

test('createType, should return default with no type', () => {
  const type = createType();

  expect(type).toEqual(ACTION_TYPE);
});

test('createType, supply a type to get a custom type', () => {
  const suffix = 'HI!';
  const type = createType(suffix);

  expect(type).toEqual(`${ACTION_TYPE}:${suffix}`);
});

test('defaultSetState, uses spread operator to merge states', () => {
  const state = {hello: 'world'};
  const nextState = {hello: 'goodbye'};
  const mergedState = defaultSetState(state, nextState);
  const expectedState = {...state, ...nextState};

  expect(mergedState).toEqual(expectedState);
});

test('executeAction, should execute the default setstate for an object type input', () => {
  const state = {hello: 'world'};
  const nextState = {hello: 'goodbye'};
  const action = setState(nextState);
  const option = createOptions();
  const newState = executeAction(state, action, option);

  expect(newState).toEqual(nextState);
});

test('executeAction, should execute the input if it is a function', () => {
  const state = {count: 0};
  const expectedState = {count: 1};
  const nextState = prevState => ({...prevState, count: prevState.count + 1});
  const action = setState(nextState);
  const option = createOptions();
  const newState = executeAction(state, action, option);

  expect(newState).toEqual(expectedState);
});

test('executeAction, should override to option.setstate function', () => {
  const state = {count: 0};
  const expectedState = {count: 100};
  const nextState = prevState => ({...prevState, count: prevState.count + 1});
  const optionSetState = prevState => ({...prevState, count: 100});
  const action = setState(nextState);
  const option = createOptions({setState: optionSetState});
  const newState = executeAction(state, action, option);

  expect(newState).toEqual(expectedState);
});

test('executeAction, should not override to option.setstate if it isn\'t function', () => {
  const state = {count: 0};
  const expectedState = {count: 1};
  const nextState = prevState => ({...prevState, count: prevState.count + 1});
  const optionSetState = 'optionSetState';
  const action = setState(nextState);
  const option = createOptions({setState: optionSetState});
  const newState = executeAction(state, action, option);

  expect(newState).toEqual(expectedState);
});

test('executeAction, should do nothing if the typeof option.setstate is unsupported', () => {
  const state = {count: 0};
  const nextState = null;
  const action = setState(nextState);
  const option = createOptions();
  const newState = executeAction(state, action, option);

  expect(newState).toEqual(state);
});

test('setState, creates an action object', () => {
  const state = {hello: 'world'};
  const action = setState(state);
  const expectedAction = {
    type: ACTION_TYPE,
    payload: {setState: state}
  };

  expect(action).toEqual(expectedAction);
});

test('setState, will apply a type to the action object', () => {
  const suffix = 'HI!';
  const state = {hello: 'world'};
  const action = setState(state, suffix);
  const expectedAction = {
    type: `${ACTION_TYPE}:${suffix}`,
    payload: {setState: state}
  };

  expect(action).toEqual(expectedAction);
});
