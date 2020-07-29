import View from '../view';

class Viewer extends View {
  constructor () {
    super();

    this.$view = this.createElement('div', {class: 'slide-viewer'});
    this.$slideContainer = this.createElement('div', {class: 'slide-container'});
    this.$view.append(this.$slideContainer);
  }
}

export default Viewer;