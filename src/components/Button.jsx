// src/components/Button.jsx


export default function Button({

  children,

  onClick,

  type = "button",

  variant = "primary",

  icon,

  disabled = false,

  size = "medium",

}) {


  return (

    <button

      type={type}

      onClick={onClick}

      disabled={disabled}

      className={`
        button
        button-${variant}
        button-${size}
      `}

    >


      {

        icon && (

          <span className="button-icon">

            {icon}

          </span>

        )

      }



      <span>

        {children}

      </span>


    </button>

  );

}
