import { NavLink } from "@remix-run/react";
import { Fragment } from "react";

export default function Nav({ data, id }: any) {
  return <Recursive data={data} id={id} />;
}

const Recursive = ({ data, id, parent = "" }: any) => {
  return (
    <div>
      {data?.map(({ title, children }: any) =>
        children.length > 0 ? (
          <Fragment key={title}>
            {id ? (
              <NavLink to={parent + "/" + title}>{title}</NavLink>
            ) : (
              <label>{title}</label>
            )}

            <Recursive data={children} id={id} parent={parent + "/" + title} />
          </Fragment>
        ) : (
          <NavLink to={parent + "/" + title} key={title}>
            {title}
          </NavLink>
        )
      )}
    </div>
  );
};
