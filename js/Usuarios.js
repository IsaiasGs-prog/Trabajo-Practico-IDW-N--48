document.addEventListener("DOMContentLoaded", async () => {
  const tablaUsuarios = document.getElementById("tabla-usuarios");

  try {
    const respuesta = await fetch("https://dummyjson.com/users");
    const datos = await respuesta.json();

    datos.users.forEach(user => {
      const fila = `
        <tr>
          <td>${user.id}</td>
          <td><img src="${user.image}" alt="Foto" width="40" height="40" class="rounded-circle"></td>
          <td>${user.username}</td>
          <td>${user.firstName} ${user.lastName}</td>
          <td>${user.email}</td>
          <td>${user.university ?? "—"}</td>
        </tr>
      `;
      tablaUsuarios.insertAdjacentHTML("beforeend", fila);
    });
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    tablaUsuarios.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Error al cargar usuarios</td></tr>`;
  }
});
