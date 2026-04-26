async function test() {
  try {
    const res = await fetch("http://localhost:6969/api/v1/prediction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: "hot forehead" })
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);
  } catch (e) {
    console.log("ERROR:", e.message);
  }
}
test();
