# extendClassName Documentation

All UI components rendering HTML elements should use this function.

## Example

```javascript
const YourComponent = React.forwardRef((props, ref) => {
  const {
    children,
    className,
  } = extendClassName(props)
  return (
    <div
      className={ className }
      ref={ ref }
    >
      { children }
    </div>
  )
})
```

## Requirements for using this function

Your UI component should meet the following requirements.

1. Avoid deep nesting of elements or other components in its rendered html beneath the top level element/component.
2. Rather than nesting elements/components try to use the the React children prop, and let container components specify how components are nested under yours instead.  If you intend for specific components to act as default children for your top level component.  Attach them as static properties to your top level component on export.
3. It should pass the className prop to the top level element.
4. It must have the defaultClassName prop defined in the defaultProps static property.  This default class name should be defined in the Responsive css.
5. It should use the React.forwardRef api to pass refs defined by the consumers of your Ui component to the top level element rendered by your component.

## Why do we need this?

Combining React components with B.E.M. defined styles in responsive has brought a number of difficulties this function seeks to solve.

1. HTML element class names have been typically hard coded in components.
2. This hard coding limits re-use as classes can't be over-ridden.
3. Doesn't easily allow for modifier classes to be applied (also limiting re-use).
4. Makes it harder to create a consistent interface for the application of modifier classes.
5. Increases cognitive overhead for developers having to remember responsive class names before they can make use of already defined styles - which is even worse because styles aren't co-located with components.
6. Swapping out styles over time is more time consuming since they are cut and pasted repeatedly in multiple instances of components making use of them.  By using composition over components with defaultClassName prop declarations we should only ever need to declare a responsive className once.

## What does it do

This function extends the react className interface.  So long as you follow the requirements above it will allow you to do the following.

### Specify a default class name for your component

You can/must specify a default class name for your component by specifying a value for the 'defaultClassName' prop in the defaultProps static property.  If the consumer of your component does not pass a className prop then your default class name will be used instead.

By specifying a className prop when using your component your default is over ridden.

### Allows consumers of your component to easily append a class name to your default.

A common pattern is that users of components need to append class names to the default.  If the consumer of your component specifies the appendClassName prop then that will be appended to the default you have specified.

### Create a boolean prop interface for modifier classes

By specifying a value for the cxToBoolProps in the defaultProps static property of your component you can create a boolean interface for consumers of your component to easily add pre-defined modifier classes.

```javascript
Button.defaultProps = {
  cxToBoolProps: ({ clicked }) => ({
    'my-clicked-class': clicked,
  })
}
```

When consumers of your component add a 'clicked' boolean prop with the value true, 'my-clicked-class' will be appended to the default and any appended class names.

```javascript
const TheirComponent = props => <Button { ...props } clicked />
```
