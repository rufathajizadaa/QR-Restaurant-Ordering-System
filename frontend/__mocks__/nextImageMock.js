// next/image → plain <img> for Jest
const React = require('react')

module.exports = function NextImageMock(props) {
  const { src, alt, width, height, ...rest } = props
  return <img src={src} alt={alt} width={width} height={height} {...rest} />
}
