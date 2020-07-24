export default function () {
  console.log('hello world')
  import(/* webpackChunkName: "test1", webpackPreload: true */ './component/test').then(({default: testFn}) => {
    testFn()
  })
}

export function treeShakingUnuse() {
  console.log('hello tree shaking')
}

export function foo1 () {
  console.log('hell1o foo')
}

export async function lodashJoin () {
// webpackChunkName -> 生成 vendors_lodash.js
  let {default: _} = await import(/* webpackChunkName: "lodash" */ 'lodash')
  let str = _.join(['Hello', 'import()', 'lodash'], ' ')
  console.log('lodashJoin: ', str)
}
