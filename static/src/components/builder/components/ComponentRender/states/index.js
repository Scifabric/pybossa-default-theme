import * as timer from './timer';
import * as taskPresenter from './taskPresenter'
const DEFAULT_STATE = {
    active: true
};
export default {
    'task-timer': timer,
    'task-presenter': taskPresenter,
    'default': {
        states: DEFAULT_STATE
    }
}