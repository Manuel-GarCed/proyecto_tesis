import React, { useState, useEffect } from 'react';

export default function Profile() {
  const currentUsername = localStorage.getItem('currentUser');
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast]     = useState(false);

  // 1) Al montar, carga vía API REST el perfil
  useEffect(() => {
    fetch(`http://localhost:3001/users?username=${currentUsername}`)
      .then(r => r.json())
      .then(arr => {
        const user = arr[0];
        setProfile({
          id:        user.id,
          username:  user.username,
          password:  '',            // no mostramos la clave real
          email:     user.email,
          phone:     user.telefono,
          avatarUrl: user.avatarUrl,
        });
        setPreview(user.avatarUrl);
      });
  }, [currentUsername]);

  // 2) Al entrar después de guardar, mira flag y muestra toast
  useEffect(() => {
    if (localStorage.getItem('profileSaved')) {
      setToast(true);
      localStorage.removeItem('profileSaved');
      setTimeout(() => setToast(false), 3000);
    }
  }, []);

  if (!profile) return <div>Cargando perfil…</div>;

  // Handlers
  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const handleAvatar = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(p => ({ ...p, avatarUrl: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      id:       profile.id,
      username: profile.username,
      password: profile.password || undefined,
      email:    profile.email,
      telefono: profile.phone,
      avatarUrl: profile.avatarUrl,
    };
    await fetch(`http://localhost:3001/users/${profile.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // Ponemos flag para el toast y recargamos
    localStorage.setItem('profileSaved', '1');
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 relative">
      {toast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
          Cambios guardados satisfactoriamente
        </div>
      )}

      <h1 className="text-3xl font-bold">Mi Perfil</h1>

      {/* Avatar clicable + ID */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatar}
            className="hidden"
          />
          <label htmlFor="avatarInput" className="cursor-pointer block">
            {preview
              ? <img src={preview} alt="Avatar"
                     className="w-24 h-24 rounded-full object-cover border"/>
              : <div className="w-24 h-24 rounded-full bg-gray-200 
                               flex items-center justify-center text-gray-500 border">
                  Sin foto
                </div>
            }
            <div className="absolute inset-0 rounded-full 
                            bg-black opacity-0 hover:opacity-20 transition-opacity"/>
          </label>
        </div>
        <div>
          <div className="text-gray-600">ID de usuario</div>
          <div className="text-xl font-mono">{profile.id}</div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow space-y-4">
        {/* Usuario */}
        <div>
          <label className="block mb-1 font-semibold">Usuario</label>
          <input
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded 
                       focus:outline-none focus:ring-2 focus:ring-cielo"
            required
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="block mb-1 font-semibold">Contraseña</label>
          <input
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded 
                       focus:outline-none focus:ring-2 focus:ring-cielo"
            placeholder="••••••••"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block mb-1 font-semibold">Teléfono</label>
          <input
            name="phone"
            type="tel"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded 
                       focus:outline-none focus:ring-2 focus:ring-cielo"
            placeholder="+56 9 1234 5678"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded 
                       focus:outline-none focus:ring-2 focus:ring-cielo"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        {/* Guardar */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-cielo-oscuro text-white px-6 py-2 rounded-lg 
                       hover:bg-cielo transition"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}