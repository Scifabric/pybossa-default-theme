export function bindGetters(unboundGetters, state) {
  const gettersDescriptor = Object.entries(unboundGetters).reduce(getterReducer, {});
  const getters = Object.defineProperties({}, gettersDescriptor);
  return getters;

  function getterReducer(objectDescriptor, [getterName, getterFunc]) {
    return Object.assign(
      objectDescriptor,
      {
        [getterName]: {
          get() {
              return getterFunc(state, getters);
          }
        }
      }
    );
  }
}

