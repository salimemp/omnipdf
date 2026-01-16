import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    const path = searchParams.get("path") || "/";

    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 },
      );
    }

    const accessToken = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let files: any[] = [];

    switch (provider) {
      case "google-drive":
        const driveResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${encodeURIComponent(`'${path}' in parents and trashed=false`)}'&pageSize=100&fields=files(id,name,mimeType,size,modifiedTime,parents,thumbnailLink,webViewLink)`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (driveResponse.ok) {
          const data = await driveResponse.json();
          files = (data.files || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            type: file.mimeType.split("/").pop(),
            size: parseInt(file.size) || 0,
            modifiedAt: file.modifiedTime,
            path: path,
            thumbnailUrl: file.thumbnailLink,
            shared: !!file.webViewLink,
          }));
        }
        break;

      case "dropbox":
        const dropboxResponse = await fetch(
          "https://api.dropboxapi.com/2/files/list_folder",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path: path === "/" ? "" : path }),
          },
        );
        if (dropboxResponse.ok) {
          const data = await dropboxResponse.json();
          files = (data.entries || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            type: file.name.split(".").pop() || "file",
            size: file.size || 0,
            modifiedAt: file.client_modified,
            path: file.path_display,
            shared: file.sharing_info?.read_only || false,
          }));
        }
        break;

      case "onedrive":
        const onedriveResponse = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/root:${path}:/children?$top=100`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (onedriveResponse.ok) {
          const data = await onedriveResponse.json();
          files = (data.value || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            type: file.name.split(".").pop() || "file",
            size: file.size || 0,
            modifiedAt: file.lastModifiedDateTime,
            path: file.parentReference?.path + "/" + file.name || path,
            shared: file.shared?.scope === "anonymous",
          }));
        }
        break;

      case "box":
        const boxResponse = await fetch(
          `https://api.box.com/2.0/folders/${path === "/" ? "0" : path}/items`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (boxResponse.ok) {
          const data = await boxResponse.json();
          files = (data.entries || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            type:
              file.type === "folder"
                ? "folder"
                : file.name.split(".").pop() || "file",
            size: file.size || 0,
            modifiedAt: file.modified_at,
            path:
              file.path_collection?.entries?.[0]?.name + "/" + file.name ||
              file.name,
            shared: !!file.shared_link,
          }));
        }
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported cloud provider" },
          { status: 400 },
        );
    }

    return NextResponse.json({ files });
  } catch (error: any) {
    console.error("List files API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list files" },
      { status: 500 },
    );
  }
}
