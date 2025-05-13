const { registerFormatType, applyFormat, removeFormat } = wp.richText;
const RichTextToolbarButton =
  wp.blockEditor?.RichTextToolbarButton || wp.editor?.RichTextToolbarButton;
const ColorPalette = wp.blockEditor?.ColorPalette || wp.editor?.ColorPalette;
const Popover =
  wp.components?.Popover || wp.blockEditor?.Popover || wp.editor?.Popover;
const { createElement, useState } = wp.element;
const { __ } = wp.i18n;
const { select } = wp.data;

const ColorButton = ({ isActive, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const palette = (
    window.headingFormattersPalette?.settings?.color?.palette || []
  ).map((c) => ({
    name: c.name,
    color: c.color,
  }));

  const getCurrentColor = () => {
    const formats = value?.activeFormats || [];
    const match = formats.find((f) => f?.type === "custom/inline-color");
    if (!match || !match.attributes?.style) return undefined;
    const style = match.attributes.style;
    const matchColor = style.match(/color:\s*(#[0-9a-fA-F]{3,6})/);
    return matchColor ? matchColor[1] : undefined;
  };

  const currentBlock = wp.data
    .select("core/block-editor")
    ?.getSelectedBlock?.();
  if (!currentBlock || currentBlock.name !== "core/heading") return null;
  if (!RichTextToolbarButton || !ColorPalette || !Popover) return null;

  return createElement(
    "div",
    null,
    createElement(RichTextToolbarButton, {
      icon: "admin-customizer",
      title: __("Tekstkleur"),
      onClick: () => setShowPicker(!showPicker),
      isActive,
    }),
    showPicker &&
      createElement(
        Popover,
        {
          position: "bottom center",
          onClose: () => setShowPicker(false),
        },
        createElement(ColorPalette, {
          value: getCurrentColor(),
          onChange: (color) => {
            if (!color) {
              onChange(removeFormat(value, "custom/inline-color"));
            } else {
              const newValue = applyFormat(value, {
                type: "custom/inline-color",
                attributes: { style: "color: " + color },
              });
              onChange(newValue);
            }
            setShowPicker(false);
          },
          colors: palette,
          disableCustomColors: true,
          clearable: false, // ✅ voorkomt standaard “Wissen” knop van WordPress
        }),
        createElement(
          "button",
          {
            className:
              "components-button is-primary is-compact inline-color__reset",
            onClick: () => {
              onChange(removeFormat(value, "custom/inline-color"));
              setShowPicker(false);
            },
          },
          __("Wissen")
        )
      )
  );
};

registerFormatType("custom/inline-color", {
  title: __("Tekstkleur"),
  tagName: "span",
  className: "inline-color",
  isInline: true,
  attributes: {
    style: "style",
    class: "class",
  },
  edit: ColorButton,
});

const UnderlineButton = ({ isActive, value, onChange }) => {
  const selectedBlock = wp.data.select("core/block-editor").getSelectedBlock();
  if (!selectedBlock || selectedBlock.name !== "core/heading") return null;

  return createElement(RichTextToolbarButton, {
    icon: "editor-underline",
    title: __("Onderstrepen"),
    onClick: () => {
      const newValue = isActive
        ? removeFormat(value, "custom/custom-underline")
        : applyFormat(value, {
            type: "custom/custom-underline",
            attributes: {},
          });
      onChange(newValue);
    },
    isActive,
  });
};

registerFormatType("custom/custom-underline", {
  title: __("Onderstrepen"),
  tagName: "u",
  className: null, // 👈 belangrijk!
  isInline: true,
  attributes: null,
  edit: UnderlineButton,
});
