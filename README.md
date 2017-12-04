# redux-setstate-reducer

Synchronus and functional setState with redux

[![npm](https://img.shields.io/npm/v/redux-setstate-reducer.svg)](https://www.npmjs.com/package/redux-setstate-reducer)

### Install

```
npm install redux-setstate-reducer
```

### Basic Usage

```js
import { createStore } from 'redux';
import { createReducer, setState } from 'redux-setstate-reducer';

// Create a reducer for the app
const reducer = createReducer({
  initialState: {count: 0}
});

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()););

store.dispatch(setState(state => ({...state, count: state.count + 1})));
// {count: 1}
store.dispatch(setState(state => ({...state, count: state.count - 1})));
// {count: -1}
store.dispatch(setState({count: 10}));
// {count: 10}
```

## Why?

React's setState function is really powerful, BUT it is asynchronous. Redux is
synchronous and allows you to implement setState functionally.

Redux-setstate-reducer also give you the ability to use redux without having to
scaffold out boilerplate.

## API

So how do you use the library?

### `setState(updater, [type])`

The library's action creator to dispatch. You can either pass it a function or
an object and it will execute the appropriate function in the reducer.

```js
// ...

console.log(store.getState());
// {count: 0}

// Using a function
store.dispatch(setState(state => ({...state, count: state.count + 1})));
// {count: 1}

// Using the default merge operation ({...state, ...newState})
store.dispatch(setState({count: 10}));
// {count: 10}
```

_type_ allows for targeting a reducer by it's type

```js
// ...

const reducer = createReducer({
  initialState: {count: 0}
  type: 'COUNT'
})
const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

// Will ignore the global setState action
store.dispatch(setState(state => ({...state, count: state.count + 1})));
// {count: 0}

// Executes the correct type
store.dispatch(setState({count: 10}, 'COUNT'));
// {count: 10}
```

### `createReducer([options])`

Create a reducer for the app or just for a slice. _options_ allow for
customizing the reducer

Create a single reducer

```js
// ...

const reducer = createReducer({
  initialState: {count: 0}
});

const store = createStore(reducer);

console.log(store.getState());
// {count: 0}
```

Create multiple reducer slices

```js
// ...

const reducer = combineReducers({
  default: createReducer(),
  first: createReducer(),
  second: createReducer()
});

const store = createStore(reducer);

console.log(store.getState());
// {default: {}, first: {}, second: {}}
```

### `extendReducer(reducer, [options])`

Extends an existing reducer. _options_ alows for customizing the reducer

```js
// ...

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const reducer = extendReducer(counterReducer);
const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

// Will ignore the global setState action
store.dispatch({type: 'INCREMENT'});
// 1

// Executes the correct type
store.dispatch(setState(state => 10));
// 10
```

#### options

* `initialState [Object = {}]` The initial state of the reducer. Defaults to an
  empty object.

```js
// ...

const reducer = createReducer({
  initialState: {count: 0}
});

const store = createStore(reducer);

console.log(store.getState());
// {count: 0}
```

* `setState(state) [Function]` A custom function to run on the reducer. When run
  it will take the current state of the store and pass it into the function.
  This function overrides any arguments passed into the action creator.

```js
// ...

const reducer = createReducer({
  initialState: {count: 1}
  setState: state => ({...state, count: state.count * 2});
});

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

console.log(store.getState());
// {count: 1}

store.dispatch(setState());
// 2

// Anything passed into setState is ignored
store.dispatch(setState({ignore: 'me'}));
// 4

// Anything passed into setState is ignored
store.dispatch(setState(state => state));
// 8
```

* `type [String]`: 'A custom type for the reducer. This decouples it from the
  generic action creator and allows you to target a reducer specifically'

See setState type example
