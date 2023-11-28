import { User } from "@prisma/client";

export default function ({ profil }: { profil?: User }) {
  return (
    <div className="badge">
      <img src={profil?.avatar} width={30} height={30} />
      <span>
        <strong>{profil?.firstname}</strong>
        <br />
        <i>{profil?.lastname}</i>
      </span>
    </div>
  );
}
