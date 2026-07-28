// src/components/Card.jsx


export default function Card({

  title,

  children,

  icon,

  variant = "default",

}) {


  return (

    <section

      className={`card card-${variant}`}

    >


      <div className="card-header">


        {

          icon && (

            <span className="card-icon">

              {icon}

            </span>

          )

        }



        {

          title && (

            <h2>

              {title}

            </h2>

          )

        }


      </div>



      <div className="card-body">

        {children}

      </div>



    </section>

  );

}
