export default function Button({

  children,

  onClick,

  type = "button",

  variant = "primary",

  disabled = false,

}) {

  return (

    <button

      type={type}

      onClick={onClick}

      disabled={disabled}

      className={`button button-${variant}`}

    >

      {children}

    </button>

  );

}
