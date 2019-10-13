# \<direwolf-elements>

The Web Components in this package are the base elements for any Direwolf Space. Any element that wants to have access to the global and shared states needs to implement `direwolf-node-mixin`.

## Installation
```bash
npm i direwolf-elements
```

## Usage
```html
<script type="module">
  import 'direwolf-elements/direwolf-elements.js';
</script>

<direwolf-elements></direwolf-elements>
```

## Development

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Testing using karma (if applied by author)
```bash
npm run test
```

## Testing using karma via browserstack (if applied by author)
```bash
npm run test:bs
```

## Demoing using storybook (if applied by author)
```bash
npm run storybook
```

## Linting (if applied by author)
```bash
npm run lint
```
