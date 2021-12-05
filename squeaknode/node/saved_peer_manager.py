# MIT License
#
# Copyright (c) 2020 Jonathan Zernik
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
from typing import List
from typing import Optional

import sqlalchemy

from squeaknode.core.peer_address import Network
from squeaknode.core.peer_address import PeerAddress
from squeaknode.core.peers import create_saved_peer
from squeaknode.core.squeak_peer import SqueakPeer
from squeaknode.db.squeak_db import SqueakDb


SEED_PEERS = {
    'squeakhub': PeerAddress(
        network=Network.IPV4,
        host='squeakhub.com',
        port=8555,
    )
}


class SavedPeerManager:

    def __init__(self, squeak_db: SqueakDb, seed_peers_dict=SEED_PEERS):
        self.squeak_db = squeak_db
        self.seed_peers_dict = seed_peers_dict

    @property
    def seed_peer_names(self):
        return self.seed_peers_dict.keys()

    def create_saved_peer(self, peer_name: str, peer_address: PeerAddress):
        # TODO: Check if peer name or peer address is in seed peers config dict.
        squeak_peer = create_saved_peer(
            peer_name,
            peer_address,
        )
        return self.squeak_db.insert_peer(squeak_peer)

    def get_saved_peer(self, peer_id: int) -> Optional[SqueakPeer]:
        return self.squeak_db.get_peer(peer_id)

    def get_saved_peer_by_address(self, peer_address: PeerAddress) -> Optional[SqueakPeer]:
        return self.squeak_db.get_peer_by_address(peer_address)

    def get_saved_peers(self):
        peers = self.squeak_db.get_peers()
        return [
            peer
            for peer in peers
            if peer.peer_name not in self.seed_peer_names
        ]

    def get_seed_peer(self, peer_name: str) -> Optional[SqueakPeer]:
        if peer_name not in self.seed_peer_names:
            return None
        return self.squeak_db.get_peer_by_name(peer_name) or \
            self.get_default_seed_peer(peer_name=peer_name)

    def get_seed_peers(self):
        ret = []
        for seed_peer_name in self.seed_peer_names:
            ret.append(self.get_seed_peer(seed_peer_name))
        return ret

    def get_autoconnect_peers(self) -> List[SqueakPeer]:
        # return self.squeak_db.get_autoconnect_peers()
        peers = self.get_saved_peers() + self.get_seed_peers()
        return [
            peer
            for peer in peers
            if peer.autoconnect
        ]

    def set_peer_autoconnect(self, peer_id: int, autoconnect: bool):
        self.squeak_db.set_peer_autoconnect(peer_id, autoconnect)

    def set_peer_autoconnect_by_name(self, peer_name: str, autoconnect: bool):
        self.insert_default_seed_peer(peer_name)
        self.squeak_db.set_peer_autoconnect_by_name(peer_name, autoconnect)

    def set_peer_share_for_free(self, peer_id: int, share_for_free: bool):
        self.squeak_db.set_peer_share_for_free(peer_id, share_for_free)

    def set_peer_share_for_free_by_name(self, peer_name: str, share_for_free: bool):
        self.insert_default_seed_peer(peer_name)
        self.squeak_db.set_peer_share_for_free_by_name(
            peer_name, share_for_free)

    def rename_peer(self, peer_id: int, peer_name: str):
        self.squeak_db.set_peer_name(peer_id, peer_name)

    def delete_peer(self, peer_id: int):
        self.squeak_db.delete_peer(peer_id)

    def get_default_seed_peer(self, peer_name: str) -> SqueakPeer:
        return SqueakPeer(
            peer_id=None,
            peer_name=peer_name,
            address=self.seed_peers_dict[peer_name],
            autoconnect=True,
            share_for_free=False,
        )

    def insert_default_seed_peer(self, peer_name: str) -> None:
        default_peer = self.get_default_seed_peer(peer_name)
        # TODO: handle sql exception in db class.
        try:
            self.squeak_db.insert_peer(default_peer)
        except sqlalchemy.exc.IntegrityError:
            pass
