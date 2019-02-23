import _ from 'lodash';
import './style.scss';
import Icon from './max-milhas.svg';

function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = "<span class='max'>Max</span> <span class='milhas'>Milhas</span>"

  // Add the image to our existing div.
  var myIcon = new Image();
  myIcon.src = Icon; +
  element.appendChild(myIcon);

  return element;
}

let element = component(); // Store the element to re-render on print.js changes
document.body.appendChild(element);

if (module.hot) {
  module.hot.accept('./', function () {
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  })
}