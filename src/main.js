// @ts-ignore
import * as moment from 'moment'
// @ts-ignore
import * as _ from 'lodash'
import lazyLoad, { lodashJoin } from "./app";
import './index.css'

console.log('env: ', process.env.NODE_ENV)

console.log('main-moment: ', moment().format())
console.log('lodash —: ', _.join(['a', 'b', 'c'], '-'))
lodashJoin()

function component() {
  // 请使用babel
  let element = document.createElement('div');
  element.innerHTML = 'hello react' + new Date()
  element.classList.add('red')
  element.classList.add('bg-logo')

  var button = document.createElement('button')
  button.innerText = '点击 app'
  button.onclick = lazyLoad
  element.appendChild(button)


  return element;
}

var element = component(); // 当 app.js 改变导致页面重新渲染时，重新获取渲染的元素
document.body.appendChild(element);

// if (module.hot) {
//   module.hot.accept('./app.js', function() {
//     console.log('Accepting the updated App module...');
//     document.body.removeChild(element)
//     element = component(); // 重新渲染页面后，component 更新 click 事件处理
//     document.body.appendChild(element);
//   })
// }

