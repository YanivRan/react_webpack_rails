module ReactWebpackRails
  module ViewHelpers
    def react_element(integration_name, payload = {}, html_options = {}, &block)
      data = {
        integration_name: integration_name,
        payload: payload,
        react_element: true
      }
      html_options = html_options.merge(data: data)
      html_tag = html_options.delete(:tag) || :div
      content_tag(html_tag, '', html_options, &block)
    end

    def react_component(name, props = {}, options = { ssr: false })
      props = camelize_props_key(props) if Rails.application.config.react.camelize_props
      react_element('react-component', { props: props, name: name }, options)
    end

    def react_router(name, props)
      react_element('react-router', name: name, props: props)
    end

    private

    def camelize_props_key(props)
      return props unless props.is_a?(Hash)
      props.each_with_object({}) do |h, (k, v)|
        h[k.to_s.camelize(:lower)] = v.is_a?(Hash) ? camelize_props_key(v) : v
        h
      end
    end
  end
end
