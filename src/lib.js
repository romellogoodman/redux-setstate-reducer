/**
 * Action type for the reducer
 * @type {String}
 */
export const ACTION_TYPE = 'SETSTATE_MW';

/**
 * Creates the type for the action
 * @param {String} type A suffix to create a custom type
 * @return {String} The custom type
 */
export const createType = (type = '') => `${ACTION_TYPE}${type && `:${type}`}`;

/**
 * Merge initial and custom options
 * @param {Object} options Custom options
 * @return {Object} Merged options
 */
export const createOptions = (options = {}) => {
  const initialOptions = {
    initialState: {},
    setState: null,
    type: ''
  };

  return {...initialOptions, ...options};
};

/**
 * Action creator for the reducer
 * @param {Object|String} payload The setState object or function
 * @param {String} type A suffix to create a custom type
 * @return {Object} A redux action object
 */
export const setState = (payload, type) => {
  return {
    type: createType(type),
    payload: {setState: payload}
  };
};

/**
 * The default setState function
 * @param {Object} state initial state
 * @param {Object} nextState new state
 * @return {Object}           [description]
 */
export const defaultSetState = (state, nextState) => {
  return {...state, ...nextState};
};

/**
 * [executeAction description]
 * @param {[type]} state   [description]
 * @param {Object} action  [description]
 * @param {[type]} options [description]
 * @return {[type]}         [description]
 */
export const executeAction = (state, action = {}, options = {}) => {
  const nextState = {...state};
  const optionsSetState = options.setState;
  const payloadSetState = action.payload && action.payload.setState;

  if (action.type && action.type === createType(options.type)) {
    if (optionsSetState && typeof options.setState === 'function') {
      return optionsSetState(nextState);
    } else if (payloadSetState && typeof payloadSetState === 'object') {
      return defaultSetState(nextState, payloadSetState);
    } else if (payloadSetState && typeof payloadSetState === 'function') {
      return payloadSetState(nextState);
    }

    console.error(
      `${typeof payloadSetState} is not a supported type for action.payload.setState.`
    );

    return nextState;
  }

  return state;
};

/**
 * [createReducer description]
 * @param {[type]} options [description]
 * @return {[type]}         [description]
 */
export const createReducer = options => {
  const reducerOptions = createOptions(options);

  return (state = reducerOptions.initialState, action) => {
    const nextState = {...state};

    return executeAction(nextState, action, reducerOptions);
  };
};

/**
 * [extendReducer description]
 * @param {[type]} reducer [description]
 * @param {[type]} options [description]
 * @return {[type]}         [description]
 */
export const extendReducer = (reducer, options) => {
  const reducerOptions = createOptions(options);

  return (state, action) => {
    const nextState = executeAction(state, action, reducerOptions);

    return reducer(nextState, action);
  };
};
