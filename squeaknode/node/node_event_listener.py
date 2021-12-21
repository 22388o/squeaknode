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
from squeaknode.core.update_subscriptions_event import UpdateSubscriptionsEvent
from squeaknode.core.update_twitter_stream_event import UpdateTwitterStreamEvent
from squeaknode.node.listener_subscription_client import EventListener


class NodeEventListener:

    def __init__(self):
        self.new_squeak_listener = EventListener()
        self.new_received_offer_listener = EventListener()
        self.new_secret_key_listener = EventListener()
        self.new_follow_listener = EventListener()
        self.twitter_stream_change_listener = EventListener()

    def handle_new_squeak(self, squeak):
        self.new_squeak_listener.handle_new_item(squeak)

    def handle_new_received_offer(self, received_offer):
        self.new_received_offer_listener.handle_new_item(received_offer)

    def handle_new_secret_key(self, squeak):
        self.new_secret_key_listener.handle_new_item(squeak)

    def handle_new_follow(self):
        self.new_follow_listener.handle_new_item(UpdateSubscriptionsEvent())

    def handle_new_twitter_stream(self):
        self.twitter_stream_change_listener.handle_new_item(
            UpdateTwitterStreamEvent()
        )

    def yield_new_squeaks(self, stopped):
        yield from self.new_squeak_listener.yield_items(stopped)

    def yield_new_received_offers(self, stopped):
        yield from self.new_received_offer_listener.yield_items(stopped)

    def yield_new_secret_keys(self, stopped):
        yield from self.new_secret_key_listener.yield_items(stopped)

    def yield_new_follows(self, stopped):
        yield from self.new_follow_listener.yield_items(stopped)

    def yield_new_twitter_stream(self, stopped):
        yield from self.twitter_stream_change_listener.yield_items(stopped)
