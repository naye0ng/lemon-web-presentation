import {titlebarView, viewerView, editorView, toolbarView} from '../view';

class EditorController {
  constructor (model) {
    this.model = model;
    this.titlebarView = titlebarView();
    this.viewerView = viewerView();
    this.editorView = editorView();
    this.toolbarView = toolbarView();
  }

  init () {
    this.renderView();
    this.bindEventHandler();
    this.run();
  }

  renderView () {
    this.titlebarView.render();
    this.viewerView.render();
    this.editorView.render();
    this.toolbarView.render();
  }

  bindEventHandler () {
    ['click', 'change'].forEach(
      type => this.titlebarView.bindTitlebarEvent(type, this.eventHandler.bind(this)));
    ['click', 'input'].forEach(type => this.toolbarView.bindToolbarEvent(type, this.eventHandler.bind(this)));

    this.editorView.bindEditorEvent('input', this.eventHandler.bind(this));
  }

  run () {
    // if (!this.model.isStorageEmpty()) {
    //   const response = confirm('최근 작성한 프레젠테이션을 불러올까요?');
    //   if (response) return this.bindStorageSlide();
    // }
    return this.createSlide();
  }

  eventHandler (target) {
    const {id, value} = target;
    switch (id) {
      case 'save': return this.savePresentation();
      case 'new': return this.createPresentation();
      case 'delete': return this.deletePresentation();
      case 'slide-delete': return this.deleteSlide();
      case 'slide-create': return this.createSlide();
      case 'slide-copy': return this.copySlide();
      case 'before': return this.focusOnBeforeSlide();
      case 'next': return this.focusOnNextSlide();
      case 'raw-data': return this.updateSlide(value);
      case 'pt-note': return this.updateNote(value);
      case 'presentation-title': return this.updateTitle(value);
      case 'slide-number': return this.focusOnNthSlide(value - 1);
      case 'presentation-selector': return this.selectPresentation(value);
      case 'background-color':
      case 'color':
        return this.updateAttribute(target);
      case 'float':
      case 'left':
      case 'middle':
      case 'right':
        return this.toggleAttributeButton(target);
      default:
    }
  }

  toggleAttributeButton (target) {
    if (target.classList[0] === 'active') return;
    document.querySelector('.align-btn > button.active').classList.remove('active');
    target.classList.add('active');
    this.updateAttribute(target);
  }

  updateAttribute ({name, value}) {
    const {slideDOM} = this.model.getSlide();
    slideDOM.style[name] = value;
  }

  deactivateSlide () {
    const {slideDOM} = this.model.getSlide();
    slideDOM.classList.remove('active');
  }

  activateSlide () {
    const {slideDOM} = this.model.getSlide();
    slideDOM.classList.add('active');
  }

  resetPreview () {
    this.viewerView.reset();
    this.updateView();
  }

  resetView () {
    this.model.reset();
    this.resetPreview();
    this.updateTitleView();
  }

  updateView () {
    if (this.model.slideSize) this.activateSlide();
    this.updateEditorView();
    this.updateSelectedOptions();
  }

  updateEditorView () {
    const {slideSize, currentSlideIndex} = this.model;
    const {updateNoteTextarea, updateTextarea} = this.editorView;
    const {updateSlideNumber} = this.toolbarView;

    if (!slideSize) {
      updateNoteTextarea('');
      updateTextarea('');
      updateSlideNumber({value: 0, min: 0, max: 0});
      return;
    }
    const {note, originalData, slideDOM} = this.model.getSlide();
    updateNoteTextarea(note);
    updateTextarea(originalData);
    updateSlideNumber({value: currentSlideIndex + 1, min: 1, max: slideSize});

    this.viewerView.focusOnSlide(slideDOM.offsetTop);
  }

  updateSelectedOptions () {
    const presentations = this.model.getStorageData('presentationList') || [];
    this.titlebarView.updateSelectOption(presentations);
  }

  updateTitleView () {
    const title = this.model.getTitle();
    this.titlebarView.updateTitle(title);
  }

  bindStorageSlide (value) {
    this.model.getPresentation(value);
    this.renderStorageSlide();
  }

  renderStorageSlide () {
    const slideIDList = this.model.getSlideIDList();
    slideIDList.forEach(id => {
      const {slideDOM} = this.model.getSlide(id);
      this.viewerView.renderSlide(slideDOM);
      this.setDraggerbleSlide(slideDOM);
    });
    this.updateTitleView();
    this.updateView();
  }

  renderSlide () {
    const {slideDOM} = this.model.getSlide();
    this.viewerView.renderNthChild(slideDOM, this.model.currentSlideIndex);
    this.setDraggerbleSlide(slideDOM);
    this.updateView();
  }

  createSlide () {
    if (this.model.slideSize) this.deactivateSlide();
    this.model.createSlide();
    this.renderSlide();
  }

  deleteSlide () {
    if (!this.model.slideSize) return;
    this.model.deleteSlide();
    this.updateView();
  }

  updateSlide (newData) {
    if (!this.model.slideSize) return this.updateView();
    this.model.updateSlide(newData);
  }

  copySlide () {
    if (!this.model.slideSize) return this.updateView();
    this.deactivateSlide();
    this.model.copySlide();
    this.renderSlide();
  }

  updateNote (value) {
    this.model.updateNote(value);
  }

  updateTitle (value) {
    this.model.updateTitle(value);
  }

  resetPresentation () {
    this.resetView();
    this.createSlide();
  }

  createPresentation () {
    // TODO : 새프레젠테이션 취소가 안됨
    const response = confirm('프레젠테이션을 새로 생성하면 현재 작업이 저장되지 않습니다.\n작업중인 슬라이드를 저장하겠습니까?');
    // reset 하기전에 취소하겠냐고 물어봐야함
    if (!response) return this.resetPresentation();
    this.savePresentation(true);
  }

  savePresentation (reset) {
    if (!this.model.slideSize) return this.updateView();
    if (!this.model.savePresentation()) return alert('제목을 입력해주세요.');
    alert('프레젠테이션이 저장되었습니다.');
    if (reset) return this.resetPresentation();
    this.updateView();
  }

  deletePresentation () {
    const response = confirm('저장된 기록이 모두 삭제됩니다. 정말 삭제하시겠습니까?');
    if (!response) return;
    localStorage.clear();
    this.resetView();
  }

  selectPresentation (value) {
    if (!value || value === this.model.getTitle()) return;
    this.model.reset();
    this.resetPreview();
    this.updateTitleView();
    this.bindStorageSlide(value);
  }

  focusOnBeforeSlide () {
    if (this.model.currentSlideIndex <= 0) return;
    this.deactivateSlide();
    this.model.currentSlideIndex -= 1;
    this.updateView();
  }
  focusOnNextSlide () {
    if (this.model.currentSlideIndex >= this.model.slideSize - 1) return;
    this.deactivateSlide();
    this.model.currentSlideIndex += 1;
    this.updateView();
  }
  focusOnNthSlide (n) {
    if (n < 0 || n >= this.model.slideSize) return;
    this.deactivateSlide();
    this.model.currentSlideIndex = n;
    this.updateView();
  }

  setDraggerbleSlide (DOM) {
    // TODO: 이벤트 위임
    DOM.addEventListener('drag', e => this.dragHandler(e));
    DOM.addEventListener('dragend', ({target}) => this.dragendHandler(target));
    DOM.addEventListener('click', ({target}) => {
      this.focusOnNthSlide(this.model.getSlideOrder(target.id));
    });
  }

  dragHandler ({target, clientX, clientY}) {
    target.classList.add('drag-active');
    const parent = target.parentNode;

    const swap = document.elementFromPoint(clientX, clientY);
    if (!swap) return;
    if (swap !== target && swap.classList[0] === 'slide') {
      const targetIndex = this.model.getSlideOrder(target.id);
      const swapIndex = this.model.getSlideOrder(swap.id);

      if (targetIndex < swapIndex) {
        parent.insertBefore(target, swap.nextSibling);
      } else {
        parent.insertBefore(target, swap);
      }

      this.deactivateSlide();
      this.model.swapIndex(targetIndex, swapIndex);
      this.updateView();
    }
  }

  dragendHandler (target) {
    target.classList.remove('drag-active');
  }
}


export default EditorController;
