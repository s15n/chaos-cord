import { updateMembers } from "../../../chat/MemberList";
import { DiscordClient } from "../../DiscordClient";

export default function onGuildMembersChunk(client: DiscordClient, d: {guild_id: string, members: any[], chunk_index: number, chunk_count: number, not_found?: any[], presences?: any[], nonce?: string}) {
    const g = client.getGuildPlus(d.guild_id)
    if (!g) return

    if (d.chunk_index === 0) g.members = []

    g.members.push(...d.members)

    if (d.chunk_index === d.chunk_count - 1) updateMembers(g.members)
}