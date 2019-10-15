import { createLocalVue, mount } from '@vue/test-utils';
import quizTable from '../../../components/setting/quiz_result_table.vue';

const localVue = createLocalVue();

describe('quizConfig', () => {
  let user1 = {};
  let user2 = {};
  let user3 = {};

  let users = {};
  let model = {};
  let quizModeChoices = {};

  beforeEach(() => {
     user1 = { 'fullname': 'user', 'id': 1, 'quiz': { 'config': { 'completion_mode': 'short_circuit', 'csrf_token': '', 'enabled': false, 'passing': 7, 'questions': 7, 'short_circuit': true }, 'result': { 'right': 0, 'wrong': 0 }, 'status': 'not_started' } };
     user2 = { 'fullname': 'worker1', 'id': 2, 'quiz': { 'config': { 'completion_mode': 'all_questions', 'csrf_token': '', 'enabled': true, 'passing': 4, 'questions': 4, 'short_circuit': false }, 'result': { 'right': 0, 'wrong': 0 }, 'status': 'not_started' } };
     user3 = { 'fullname': 'worker2', 'id': 3, 'quiz': { 'config': { 'completion_mode': 'all_questions', 'csrf_token': '', 'enabled': false, 'passing': 7, 'questions': 7, 'short_circuit': false }, 'result': { 'right': 0, 'wrong': 0 }, 'status': 'not_started' } };
     users = { '1': user1, '2': user2, '3': user3 };
     model = { 'completion_mode': 'all_questions', 'csrf': '', 'enabled': true, 'errors': {}, 'passing': 4, 'questions': 4 };
     quizModeChoices = { 'all_questions': 'Present all the quiz questions', 'short_circuit': 'End as soon as pass/fail status is known' };
  });
  it('render table with default', async () => {
    const wrapper = mount(quizTable);
    await localVue.nextTick();
    expect(wrapper.props().model).toEqual({});
    expect(wrapper.props().users).toEqual({});
    expect(wrapper.props().quizModeChoices).toEqual({});
  });

  it('render table', async () => {
    const wrapper = mount(quizTable, { propsData: { users, model, quizModeChoices } });
    await localVue.nextTick();
    expect(wrapper.props().model).toEqual(model);
    expect(wrapper.props().users).toEqual(users);
    expect(wrapper.props().quizModeChoices).toEqual(quizModeChoices);
  });

  it('call reset function', async () => {
    const wrapper = mount(quizTable, { propsData: { users, model, quizModeChoices } });
    await localVue.nextTick();
    expect(wrapper.vm.users['1'].quiz.config.passing).toBe(7);
    expect(wrapper.vm.users['1'].quiz.config.questions).toBe(7);

    wrapper.vm.reset({}, 1);
    expect(wrapper.emitted().updateUsers.length).toBe(1);
    expect(wrapper.emitted().updateUsers[0][0].quiz.config.reset).toBeTruthy();

    wrapper.vm.reset({}, 1);
    expect(wrapper.emitted().updateUsers.length).toBe(2);
    expect(wrapper.emitted().updateUsers[1][0].quiz.config.reset).toBeFalsy();
  });

  it('call checkEnable function', async () => {
    const wrapper = mount(quizTable, { propsData: { users, model, quizModeChoices } });
    await localVue.nextTick();

    wrapper.vm.checkEnable({}, 1);
    expect(wrapper.emitted().updateUsers.length).toBe(1);
  });

  it('call getStatus function', async () => {
    const wrapper = mount(quizTable, { propsData: { users, model, quizModeChoices } });
    await localVue.nextTick();

    expect(wrapper.vm.getStatus(user1)).toBe('Not Started');
    user1.quiz.config.reset = true;
    user1.quiz.config.enabled = true;

    expect(wrapper.vm.getStatus(user1)).toBe('In Progress');

    user1.quiz.config.enabled = false;
    expect(wrapper.vm.getStatus(user1)).toBe('Not Started');
  });

  it('call enableReset function', async () => {
    const wrapper = mount(quizTable, { propsData: { users, model, quizModeChoices } });
    await localVue.nextTick();
    expect(wrapper.vm.enableReset(1)).toBeTruthy();
    expect(wrapper.vm.enableReset(2)).toBeFalsy();
  });

  it('call updateAllEnable function', async () => {
    const wrapper = mount(quizTable, { propsData: { users, model, quizModeChoices } });
    await localVue.nextTick();
    expect(wrapper.vm.updateAllEnable({ target: { checked: true } }));
    expect(wrapper.vm.users['1'].quiz.config.enabled).toBeTruthy();
    expect(wrapper.vm.users['2'].quiz.config.enabled).toBeTruthy();
    expect(wrapper.vm.users['3'].quiz.config.enabled).toBeTruthy();

    expect(wrapper.vm.updateAllEnable({ target: { checked: false } }));
    expect(wrapper.vm.users['1'].quiz.config.enabled).toBeFalsy();
    expect(wrapper.vm.users['2'].quiz.config.enabled).toBeFalsy();
    expect(wrapper.vm.users['3'].quiz.config.enabled).toBeFalsy();

    expect(wrapper.vm.allRowsSelected).toBeFalsy();
  });

  it('allRowsSelected ', async () => {
    let wrapper = mount(quizTable, { propsData: { users, model, quizModeChoices } });
    await localVue.nextTick();
    expect(wrapper.vm.allRowsSelected).toBeFalsy();

    wrapper = mount(quizTable, { propsData: { users: { '2': user2 }, model, quizModeChoices } });
    await localVue.nextTick();
    expect(wrapper.vm.allRowsSelected).toBeTruthy();
  });
});
