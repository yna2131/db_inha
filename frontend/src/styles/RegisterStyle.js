export const registerstyle = `
  body {
    margin: 0;
    padding: 0;
    background-color: rgba(21, 99, 184, 1);
    min-height: 100vh;
    display: flex;
    justify-content: center;
  }

  .auth-container {
    background-color: rgba(21, 99, 184, 1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;
    box-sizing: border-box;
  }

  .auth-title {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 1);
    text-align: left;
  }

  .auth-link {
    margin: 0;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    text-align: left;
  }

  form {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: stretch;
  margin: 0;
  box-sizing: border-box;
  height: 100%;
  justify-content: flex-start;
}

.auth-submit {
  margin-top: auto;
  width: 100%;
  max-width: 300px;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(21, 99, 184, 1);
  background-color: rgba(255, 255, 255, 1);
  border: 5px solid rgba(255, 255, 255, 1);
  border-radius: 15px;
  box-sizing: border-box;
  align-self: center;
}

.auth-input, .birth-date-container input {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 1);
    background-color: rgba(21, 99, 184, 1);
    color: rgba(255, 255, 255, 1);
    width: 100%;
    box-sizing: border-box;
  }

  .birth-date-container {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }

  .auth-input::placeholder,
  .birth-date-container input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .birth-date-container > * {
    flex: 1;
    min-width: 0;
    width: 33.33%;
  }

  .birth-date-container label {
  display: none;
}

  .birth-date-container input {
    width: 100%;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 1);
    box-sizing: border-box;
  }

.auth-submit {
  margin-top: 8rem;
  width: 100%;
  max-width: 300px;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(21, 99, 184, 1);
  background-color: rgba(255, 255, 255, 1);
  border: 5px solid rgba(255, 255, 255, 1);
  border-radius: 15px;
  box-sizing: border-box;
  align-self: center;
}
`;