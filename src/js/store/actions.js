export default {
  createSlide (context, payload) {
    if (payload.isCopy && !context.state.slideSize) return alert('복사할 수 있는 슬라이드가 존재하지 않습니다.');
    context.commit('createSlide', payload);
  },

  deleteSlide (context, payload) {
    if (!context.state.slideSize) return alert('삭제할 수 있는 슬라이드가 존재하지 않습니다.');
    context.commit('deleteSlide', payload);
  },

  updateSlide (context, payload) {
    context.commit('updateSlide', payload);
  },

  updateNote (context, payload) {
    context.commit('updateNote', payload);
  },

  updateSlideAttribute (context, payload) {
    context.commit('updateSlideAttribute', payload);
  },

  updateTitle (context, payload) {
    context.commit('updateTitle', payload);
  },

  updatePTIndex (context, payload) {
    const {slideSize} = context.state;
    if (payload.index >= slideSize || payload.index < 0) return;
    context.commit('updatePTIndex', payload);
  },

  focusOnBeforeSlide (context) {
    if (context.state.currentSlideIndex <= 0) return;
    context.commit('focusOnBeforeSlide');
  },

  focusOnNextSlide (context, payload) {
    const {currentSlideIndex, slideSize} = context.state;
    if (currentSlideIndex >= slideSize - 1) return;
    context.commit('focusOnNextSlide', payload);
  },

  focusOnNthSlide (context, payload) {
    context.commit('focusOnNthSlide', payload);
  },

  savePresentation (context) {
    if (!context.state.slideSize) return alert('저장 가능한 슬라이드가 존재하지 않습니다.\n슬라이드를 생성해주세요!');
    const {title} = context.state;
    if (!title) return alert('제목을 입력하세요!');
    context.commit('savePresentation', {title});
  },

  createPresentation (context, payload) {
    const response = confirm('새로운 프레젠테이션을 생성하시겠습니까?\n(현재 작업이 저장되지 않습니다.)');
    if (!response) return;
    context.commit('createPresentation', payload);
  },

  deletePresentation (context, payload) {
    context.commit('deletePresentation', payload);
  },

  renderPresentation (context, payload) {
    context.commit('renderPresentation', payload);
  },

  eventPublish (context, payload) {
    context.commit('eventPublish', payload);
  },
};
