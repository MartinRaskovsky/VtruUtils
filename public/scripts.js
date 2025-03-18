function restoreForm() {
    window.location.href="index.cgi";
}

function logout() {
    document.cookie = 'session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    
    fetch("logout.cgi", { method: 'GET', credentials: 'include' })
        .then(() => {
            window.location.href = "index.html?nocache=" + Date.now();  // ✅ Force full reload
        });
}

function disableBackOnDashboard() {
    let backBtn = document.getElementById("backBtn");
    
    if (!backBtn) {
        return;
    }

    // Detect if we're on the dashboard
    const isDashboard = document.getElementById("dashboard-page");  

    if (isDashboard) {
        backBtn.disabled = true;
        backBtn.style.opacity = "0.5";
        backBtn.style.cursor = "not-allowed";
    }
}

// ✅ Run the function when the page is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    disableBackOnDashboard();
});
