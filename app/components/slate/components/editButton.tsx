import { useNavigate, useLocation } from "@remix-run/react";

export default function Edit({ data }: any) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <button
      onClick={() => {
        navigate("Edit", {
          state: { pathname, data },
        });
      }}
    >
      Edit
    </button>
  );
}
