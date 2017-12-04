import {combineReducers, createStore} from 'redux';
import {createReducer, extendReducer, setState} from '../src';

const TEST_TYPE = 'TEST_TYPE';
const initialTestState = {testing: false};
const testReducer = (state = initialTestState, action) => {
  switch (action.type) {
    case TEST_TYPE:
      return {...state, testing: true};
    default:
      return state;
  }
};

test('createReducer, returns a reducer', () => {
  const reducer = createReducer();
  const store = createStore(reducer);

  expect(store.getState()).toEqual({});
});

test('createReducer, should call combineReducers successfully', () => {
  const initialState = {hello: 'world'};
  const expectedState = {
    sliceA: {},
    sliceB: initialState,
    sliceC: {}
  };
  const reducer = combineReducers({
    sliceA: createReducer(),
    sliceB: createReducer({initialState}),
    sliceC: createReducer()
  });
  const store = createStore(reducer);

  expect(store.getState()).toEqual(expectedState);
});

test('createReducer, should dispatch to all reducers', () => {
  const initialState = {hello: 'world'};
  const nextState = {hello: 'goodbye'};
  const expectedState = {
    sliceA: {},
    sliceB: initialState,
    sliceC: {}
  };
  const expectedStateTwo = {
    sliceA: nextState,
    sliceB: nextState,
    sliceC: nextState
  };
  const reducer = combineReducers({
    sliceA: createReducer(),
    sliceB: createReducer({initialState}),
    sliceC: createReducer()
  });
  const store = createStore(reducer);

  expect(store.getState()).toEqual(expectedState);

  store.dispatch(setState(nextState));

  expect(store.getState()).toEqual(expectedStateTwo);
});

test('createReducer, should subscribe a reducer to a particular type', () => {
  const CUSTOM_TYPE = 'CUSTOM';
  const initialState = {hello: 'world'};
  const customState = {custom: 'custom'};
  const nextState = {hello: 'goodbye'};
  const customStateTwo = {...customState, ...nextState};
  const expectedState = {
    sliceA: {},
    sliceB: initialState,
    sliceC: customState
  };
  const expectedStateTwo = {
    sliceA: nextState,
    sliceB: nextState,
    sliceC: customState
  };
  const expectedStateThree = {
    sliceA: nextState,
    sliceB: nextState,
    sliceC: customStateTwo
  };
  const reducer = combineReducers({
    sliceA: createReducer(),
    sliceB: createReducer({initialState}),
    sliceC: createReducer({initialState: customState, type: CUSTOM_TYPE})
  });
  const store = createStore(reducer);

  expect(store.getState()).toEqual(expectedState);

  store.dispatch(setState(nextState));

  expect(store.getState()).toEqual(expectedStateTwo);

  store.dispatch(setState(nextState, CUSTOM_TYPE));

  expect(store.getState()).toEqual(expectedStateThree);
});

test('setState, default behavior is to merge state', () => {
  const initialState = {hello: 'world', goodbye: 'world'};
  const nextState = {hello: 'goodbye'};
  const expectedState = {...initialState, ...nextState};
  const reducer = createReducer({initialState});
  const store = createStore(reducer);

  expect(store.getState()).toEqual(initialState);

  store.dispatch(setState(nextState));

  expect(store.getState()).toEqual(expectedState);
});

test('setState, allows functional programs to be run on it', () => {
  const initialState = {count: 0};
  const decrement = state => ({...state, count: state.count - 1});
  const increment = state => ({...state, count: state.count + 1});
  const expectedState = {count: 1};
  const expectedStateTwo = {count: -1};
  const reducer = createReducer({initialState});
  const store = createStore(reducer);

  expect(store.getState()).toEqual(initialState);

  store.dispatch(setState(increment));

  expect(store.getState()).toEqual(expectedState);

  store.dispatch(setState(decrement));
  store.dispatch(setState(decrement));

  expect(store.getState()).toEqual(expectedStateTwo);
});

test('extendReducer, correctly returns the original reducer', () => {
  const reducer = extendReducer(testReducer);
  const store = createStore(reducer);

  expect(store.getState()).toEqual(initialTestState);
});

test('extendReducer, correctly dispatch a setstate', () => {
  const reducer = extendReducer(testReducer);
  const store = createStore(reducer);
  const nextState = {testing: false, testingTwo: true};
  const expectedState = {...initialTestState, ...nextState};

  expect(store.getState()).toEqual(initialTestState);

  store.dispatch(setState(nextState));

  expect(store.getState()).toEqual(expectedState);
});
