import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { provider, fileId, permissions, expiresIn } = await request.json();

    if (!provider || !fileId) {
      return NextResponse.json(
        { error: "Provider and fileId are required" },
        { status: 400 },
      );
    }

    const accessToken = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    let shareUrl: string;

    switch (provider) {
      case "google-drive":
        const driveResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "anyone",
              role: permissions.write ? "writer" : "reader",
            }),
          },
        );
        if (!driveResponse.ok) {
          throw new Error("Failed to create Google Drive share link");
        }
        const driveData = await driveResponse.json();
        shareUrl = `https://drive.google.com/file/d/${fileId}/view`;
        break;

      case "dropbox":
        const dropboxResponse = await fetch(
          "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              path: fileId,
              settings: {
                requested_visibility: { ".tag": "public" },
              },
            }),
          },
        );
        if (!dropboxResponse.ok) {
          throw new Error("Failed to create Dropbox share link");
        }
        const dropboxData = await dropboxResponse.json();
        shareUrl = dropboxData.url;
        break;

      case "onedrive":
        const onedriveResponse = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/createLink`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: permissions.write ? "edit" : "view",
              scope: "anonymous",
              expirationDateTime: expiresIn
                ? new Date(Date.now() + expiresIn * 1000).toISOString()
                : undefined,
            }),
          },
        );
        if (!onedriveResponse.ok) {
          throw new Error("Failed to create OneDrive share link");
        }
        const onedriveData = await onedriveResponse.json();
        shareUrl = onedriveData.link.webUrl;
        break;

      case "box":
        const boxResponse = await fetch(
          `https://api.box.com/2.0/files/${fileId}/collaborations`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              item: { type: "file", id: fileId },
              accessible_by: { type: "open" },
              role: permissions.write ? "editor" : "viewer",
            }),
          },
        );
        if (!boxResponse.ok) {
          throw new Error("Failed to create Box share link");
        }
        const boxData = await boxResponse.json();
        shareUrl =
          boxData.shared_link?.url || `https://app.box.com/s/${fileId}`;
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported cloud provider" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      shareUrl,
      expiresAt: expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : null,
    });
  } catch (error: any) {
    console.error("Share API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create share link" },
      { status: 500 },
    );
  }
}
